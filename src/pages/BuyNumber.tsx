import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageWithFallback from '../components/ImageWithFallback';
import { operationsService } from '../services/operations';
import type { AvailableService, CountryWithPrice } from '../services/operations';
import type { Country, Service } from '../types';

// Fallbacks pour les pays (emojis)
const COUNTRY_FALLBACKS: Record<string, string> = {
  'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
  'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭',
  'AT': '🇦🇹', 'PT': '🇵🇹', 'IE': '🇮🇪', 'DK': '🇩🇰', 'SE': '🇸🇪',
  'NO': '🇳🇴', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'RU': '🇷🇺',
  'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'BR': '🇧🇷',
  'MX': '🇲🇽', 'AU': '🇦🇺', 'TR': '🇹🇷', 'NG': '🇳🇬', 'ZA': '🇿🇦',
  'EG': '🇪🇬', 'MA': '🇲🇦', 'KE': '🇰🇪', 'GH': '🇬🇭', 'SN': '🇸🇳',
  'CI': '🇨🇮', 'CM': '🇨🇲', 'TN': '🇹🇳', 'DZ': '🇩🇿'
};

// Fallbacks pour les services (emojis)
const SERVICE_FALLBACKS: Record<string, string> = {
  'whatsapp': '💬', 'telegram': '✈️', 'discord': '🎮', 'instagram': '📸',
  'facebook': '👥', 'twitter': '🐦', 'tiktok': '🎵', 'snapchat': '👻',
  'google': '🔍', 'microsoft': '💻', 'apple': '🍎', 'amazon': '📦',
  'binance': '💰', 'coinbase': '🪙', 'paypal': '💳', 'uber': '🚗'
};

interface BuyNumberProps {
  onBuyNumber: (country: Country, service: Service) => void;
  onBack: () => void;
}

// Fonctions pour gérer les préférences utilisateur
const getUserPreferences = () => {
  try {
    const prefs = localStorage.getItem('userPreferences');
    return prefs ? JSON.parse(prefs) : { countries: {}, services: {} };
  } catch {
    return { countries: {}, services: {} };
  }
};

const saveUserPreferences = (prefs: { countries: Record<string, number>; services: Record<string, number> }) => {
  try {
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
  } catch {
    // Ignore les erreurs de localStorage
  }
};

const incrementUsage = (type: 'countries' | 'services', key: string) => {
  const prefs = getUserPreferences();
  prefs[type][key] = (prefs[type][key] || 0) + 1;
  saveUserPreferences(prefs);
};

export default function BuyNumber({ onBuyNumber, onBack }: BuyNumberProps) {
  // Services disponibles (avec tarification)
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [selectedService, setSelectedService] = useState<AvailableService | null>(null);

  // Pays disponibles pour le service sélectionné
  const [countriesForService, setCountriesForService] = useState<CountryWithPrice[]>([]);

  // États de chargement
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Recherche
  const [serviceSearch, setServiceSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  // Préférences utilisateur
  const [userPrefs, setUserPrefs] = useState(() => getUserPreferences());

  // Charger les services disponibles au montage
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoadingServices(true);
        const services = await operationsService.getAvailableServices();
        setAvailableServices(services);
      } catch (error) {
        console.error('Erreur chargement services:', error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    loadServices();
  }, []);

  // Charger les pays quand un service est sélectionné
  useEffect(() => {
    const loadCountries = async () => {
      if (!selectedService) {
        setCountriesForService([]);
        return;
      }

      try {
        setIsLoadingCountries(true);
        const countries = await operationsService.getCountriesForService(selectedService.code);
        setCountriesForService(countries);
      } catch (error) {
        console.error('Erreur chargement pays:', error);
        setCountriesForService([]);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    loadCountries();
  }, [selectedService]);

  const handleServiceSelect = (service: AvailableService) => {
    incrementUsage('services', service.code);
    setUserPrefs(getUserPreferences());
    setSelectedService(service);
    setCountrySearch('');
  };

  const handleCountrySelect = async (country: CountryWithPrice) => {
    if (!selectedService) return;

    incrementUsage('countries', country.code);
    setUserPrefs(getUserPreferences());

    setIsProcessing(true);
    try {
      // Construire les objets Country et Service pour onBuyNumber
      const countryObj: Country = {
        code: country.code,
        name: country.name,
        flag: country.flag,
        alphaCode: country.code,
        flags: country.flag,
      };

      const serviceObj: Service = {
        id: selectedService.code,
        code: selectedService.code,
        name: selectedService.name,
        logoUrl: selectedService.logoUrl,
        price: country.price, // Prix du pays sélectionné
      };

      await onBuyNumber(countryObj, serviceObj);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setCountriesForService([]);
    setCountrySearch('');
  };

  // Tri par popularité
  const sortByUsage = <T extends { code?: string; name: string }>(
    items: T[],
    type: 'countries' | 'services',
    getKey: (item: T) => string
  ) => {
    return [...items].sort((a, b) => {
      const usageA = userPrefs[type][getKey(a)] || 0;
      const usageB = userPrefs[type][getKey(b)] || 0;
      if (usageA !== usageB) return usageB - usageA;
      return a.name.localeCompare(b.name);
    });
  };

  const isFrequentlyUsed = (type: 'countries' | 'services', key: string) => {
    return (userPrefs[type][key] || 0) >= 2;
  };

  // Services filtrés et triés
  const filteredServices = sortByUsage(
    availableServices.filter(s =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(serviceSearch.toLowerCase())
    ),
    'services',
    s => s.code
  );

  // Pays filtrés et triés
  const filteredCountries = sortByUsage(
    countriesForService.filter(c =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
    ),
    'countries',
    c => c.code
  );

  return (
    <Layout>
      <div className="space-y-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={selectedService ? handleBackToServices : onBack}
            className="p-3 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-montserrat">
              Acheter un numéro
            </h1>
            <p className="text-gray-600 text-sm font-montserrat">
              {selectedService ? `${selectedService.name} - Choisissez un pays` : 'Choisissez un service'}
            </p>
          </div>
        </div>

        {/* Loading Services */}
        {isLoadingServices ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LoadingSpinner size="md" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Chargement</h3>
            <p className="text-gray-600 text-sm">Récupération des services...</p>
          </div>
        ) : !selectedService ? (
          /* ÉTAPE 1: Sélection du SERVICE */
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Étape 1 : Choisir le service</h2>
                <p className="text-gray-600 text-sm">WhatsApp, Telegram, Instagram...</p>
              </div>
              <div className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
                {filteredServices.length} services
              </div>
            </div>

            {/* Recherche service */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Rechercher un service..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-sm"
                />
                {serviceSearch && (
                  <button onClick={() => setServiceSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Liste des services */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Aucun service trouvé</p>
                  <p className="text-gray-400 text-sm mt-1">Essayez un autre terme</p>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <button
                    key={service.code}
                    onClick={() => handleServiceSelect(service)}
                    className="group w-full p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <ImageWithFallback
                          src={service.logoUrl}
                          fallback={SERVICE_FALLBACKS[service.code] || '📱'}
                          alt={service.name}
                          className="w-8 h-8 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-purple-700">
                            {service.name}
                          </h4>
                          {isFrequentlyUsed('services', service.code) && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              FRÉQUENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{service.countriesCount} pays</span>
                          <span>•</span>
                          <span className="text-purple-600 font-semibold">
                            à partir de {service.minPrice.toFixed(2)} $
                          </span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          /* ÉTAPE 2: Sélection du PAYS */
          <>
            {/* Service sélectionné */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ImageWithFallback
                      src={selectedService.logoUrl}
                      fallback={SERVICE_FALLBACKS[selectedService.code] || '📱'}
                      alt={selectedService.name}
                      className="w-8 h-8 rounded"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-purple-900">{selectedService.name}</h2>
                    <p className="text-purple-700 text-sm">Étape 2 : Choisir le pays</p>
                  </div>
                </div>
                <button
                  onClick={handleBackToServices}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium bg-white px-4 py-2 rounded-xl hover:bg-purple-50 transition-all duration-200"
                >
                  Changer
                </button>
              </div>
            </div>

            {/* Liste des pays */}
            {isLoadingCountries ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LoadingSpinner size="md" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Chargement des pays</h3>
                <p className="text-gray-600 text-sm">Récupération des tarifs...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Pays disponibles</h3>
                    <p className="text-gray-600 text-sm">{filteredCountries.length} pays avec tarifs</p>
                  </div>
                </div>

                {/* Recherche pays */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Rechercher un pays..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
                    />
                    {countrySearch && (
                      <button onClick={() => setCountrySearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste pays avec prix */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredCountries.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Aucun pays trouvé</p>
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        disabled={isProcessing}
                        className={`group w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                          isProcessing
                            ? 'cursor-not-allowed opacity-75 border-gray-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <ImageWithFallback
                              src={country.flag}
                              fallback={COUNTRY_FALLBACKS[country.code] || '🏳️'}
                              alt={country.name}
                              className="w-8 h-6 rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-gray-900 group-hover:text-blue-700">
                                {country.name}
                              </p>
                              {isFrequentlyUsed('countries', country.code) && (
                                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  FRÉQUENT
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">+{country.phoneCode}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-bold">
                              {country.price.toFixed(2)} $
                            </div>
                            {isProcessing ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isLoadingCountries && filteredCountries.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Comment ca marche</h4>
                    <div className="space-y-1 text-sm text-amber-800">
                      <p>1. Cliquez sur le pays de votre choix</p>
                      <p>2. L'achat se déclenche automatiquement</p>
                      <p>3. Votre numéro sera prêt instantanément</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
