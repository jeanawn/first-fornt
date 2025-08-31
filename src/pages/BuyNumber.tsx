import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageWithFallback from '../components/ImageWithFallback';
import { operationsService } from '../services/operations';
import type { Country, Service } from '../types';

// Fallbacks pour les pays (emojis)
const COUNTRY_FALLBACKS: Record<string, string> = {
  'US': '🇺🇸',
  'CA': '🇨🇦',
  'GB': '🇬🇧',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'NL': '🇳🇱',
  'BE': '🇧🇪',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'PT': '🇵🇹',
  'IE': '🇮🇪',
  'DK': '🇩🇰',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'FI': '🇫🇮',
  'PL': '🇵🇱',
  'CZ': '🇨🇿',
  'RU': '🇷🇺',
  'CN': '🇨🇳',
  'JP': '🇯🇵',
  'KR': '🇰🇷',
  'IN': '🇮🇳',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'AU': '🇦🇺',
  'TR': '🇹🇷'
};

// Fallbacks pour les services (emojis)
const SERVICE_FALLBACKS: Record<string, string> = {
  'whatsapp': '💬',
  'telegram': '✈️',
  'discord': '🎮',
  'instagram': '📸',
  'facebook': '👥',
  'twitter': '🐦',
  'tiktok': '🎵',
  'snapchat': '👻'
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [countrySearch, setCountrySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [userPrefs, setUserPrefs] = useState(() => getUserPreferences());

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, servicesData] = await Promise.all([
          operationsService.getCountries(),
          operationsService.getServices()
        ]);
        
        console.log('Countries data:', countriesData);
        console.log('Services data:', servicesData);
        
        setCountries(countriesData);
        setServices(servicesData);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Charger les services disponibles pour le pays sélectionné
  useEffect(() => {
    const loadServicesForCountry = async () => {
      if (selectedCountry) {
        try {
          // Récupérer les services disponibles pour ce pays avec leurs prix
          const countryServices = await operationsService.getServicesByCountry(selectedCountry.code);
          
          // Récupérer tous les services pour avoir les infos complètes (nom, description, logo)
          const allServices = await operationsService.getServices();
          
          // Créer la liste des services disponibles avec prix réels
          const availableServices: Service[] = countryServices
            .filter(cs => cs.isActive)
            .map(countryService => {
              // Trouver les infos du service dans la liste complète
              const serviceInfo = allServices.find(s => 
                s.code === countryService.serviceCode || s.id === countryService.serviceCode
              );
              
              return {
                id: countryService.serviceCode,
                code: countryService.serviceCode,
                name: serviceInfo?.name || countryService.serviceCode,
                description: serviceInfo?.description,
                logoUrl: serviceInfo?.logoUrl,
                price: countryService.price // Prix déjà en crédits
              };
            });
          
          setServices(availableServices);
        } catch (error) {
          console.error('Erreur chargement services pays:', error);
          setServices([]);
        }
      }
    };

    if (selectedCountry) {
      loadServicesForCountry();
    }
  }, [selectedCountry]);

  const handleServiceSelect = async (service: Service) => {
    if (!selectedCountry) return;
    
    // Incrémenter l'usage du service
    incrementUsage('services', service.code || service.id);
    setUserPrefs(getUserPreferences());
    
    setSelectedService(service);
    setIsLoading(true);
    try {
      await onBuyNumber(selectedCountry, service);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: Country | null) => {
    if (country) {
      // Incrémenter l'usage du pays
      incrementUsage('countries', country.alphaCode || country.code);
      setUserPrefs(getUserPreferences());
    }
    
    setSelectedCountry(country);
    setSelectedService(null); // Reset service selection
    setServices([]); // Clear services pendant le chargement
    setServiceSearch(''); // Reset service search
  };

  // Fonction pour trier par popularité
  const sortByUsage = (items: any[], type: 'countries' | 'services', getKey: (item: any) => string) => {
    return [...items].sort((a, b) => {
      const usageA = userPrefs[type][getKey(a)] || 0;
      const usageB = userPrefs[type][getKey(b)] || 0;
      
      // Trier par usage décroissant, puis par nom
      if (usageA !== usageB) {
        return usageB - usageA;
      }
      return a.name?.localeCompare(b.name) || 0;
    });
  };

  // Filtrer et trier les pays selon la recherche et popularité
  const filteredCountries = (() => {
    const filtered = countries?.filter(country =>
      country.name?.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code?.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.alphaCode?.toLowerCase().includes(countrySearch.toLowerCase())
    ) || [];
    
    return sortByUsage(filtered, 'countries', (country) => country.alphaCode || country.code);
  })();

  // Filtrer et trier les services selon la recherche et popularité
  const filteredServices = (() => {
    const filtered = services?.filter(service =>
      service.name?.toLowerCase().includes(serviceSearch.toLowerCase())
    ) || [];
    
    return sortByUsage(filtered, 'services', (service) => service.code || service.id);
  })();

  // Fonction pour vérifier si un item est fréquemment utilisé
  const isFrequentlyUsed = (type: 'countries' | 'services', key: string) => {
    return (userPrefs[type][key] || 0) >= 2;
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-md mx-auto">
        {/* Header moderne avec bouton retour */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-montserrat">
              Acheter un numéro 📱
            </h1>
            <p className="text-gray-600 text-sm font-montserrat">Numéros virtuels pour vos comptes</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingData ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LoadingSpinner size="md" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Chargement</h3>
            <p className="text-gray-600 text-sm">Récupération des données...</p>
          </div>
        ) : !selectedCountry ? (
          <>
            {/* Country Selection - Design moderne */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Étape 1 : Choisir le pays
                  </h2>
                  <p className="text-gray-600 text-sm">Sélectionnez votre pays de destination</p>
                </div>
                <div className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                  {filteredCountries.length} pays
                </div>
              </div>

              {/* Barre de recherche pays */}
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
                    <button
                      onClick={() => setCountrySearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Aucun pays trouvé</p>
                    <p className="text-gray-400 text-sm mt-1">Essayez un autre terme de recherche</p>
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                  <button
                    key={country.alphaCode || `${country.name}-${country.code}`}
                    onClick={() => handleCountrySelect(country)}
                    className="group p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ImageWithFallback
                          src={country.flags || country.flag}
                          fallback={COUNTRY_FALLBACKS[country.alphaCode || country.code] || '🏳️'}
                          alt={`Drapeau ${country.name}`}
                          className="w-8 h-6 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {country.name}
                          </p>
                          {isFrequentlyUsed('countries', country.alphaCode || country.code) && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              FRÉQUENT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {country.alphaCode && country.alphaCode !== country.code ? (
                            <span>{country.alphaCode} • +{country.code}</span>
                          ) : (
                            <span>+{country.code}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Selected Country Header - Design moderne */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ImageWithFallback
                      src={selectedCountry.flags || selectedCountry.flag}
                      fallback={COUNTRY_FALLBACKS[selectedCountry.alphaCode || selectedCountry.code] || '🏳️'}
                      alt={`Drapeau ${selectedCountry.name}`}
                      className="w-8 h-6 rounded"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">
                      {selectedCountry.name}
                    </h2>
                    <p className="text-blue-700 text-sm">Étape 2 : Choisir le service</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCountrySelect(null)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium bg-white px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  ← Changer
                </button>
              </div>
            </div>
          </>
        )}

        {/* Service Selection - Design moderne */}
        {selectedCountry && (
          <div>
            {services.length === 0 && !isLoadingData ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LoadingSpinner size="md" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Chargement des services</h3>
                <p className="text-gray-600 text-sm">Récupération des services disponibles...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Aucun service disponible</h3>
                <p className="text-gray-500 text-sm">Aucun service n'est disponible pour ce pays</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Services disponibles</h3>
                    <p className="text-gray-600 text-sm">{filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
                    {filteredServices.length}/{services.length}
                  </div>
                </div>

                {/* Barre de recherche services */}
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
                      placeholder="Rechercher un service (WhatsApp, Telegram...)..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-sm"
                    />
                    {serviceSearch && (
                      <button
                        onClick={() => setServiceSearch('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Aucun service trouvé</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {serviceSearch ? 'Essayez un autre terme de recherche' : `Aucun service disponible pour ${selectedCountry?.name}`}
                      </p>
                    </div>
                  ) : (
                    filteredServices.map((service, index) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      disabled={isLoading}
                      className={`group w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-105 active:scale-95 ${
                        selectedService?.id === service.id
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                      } ${
                        isLoading ? 'cursor-not-allowed opacity-75' : ''
                      } ${
                        index === 0 ? 'ring-2 ring-purple-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform ${
                          selectedService?.id === service.id 
                            ? 'bg-green-100' 
                            : 'bg-gradient-to-br from-purple-100 to-indigo-100'
                        }`}>
                          <ImageWithFallback
                            src={service.logoUrl}
                            fallback={SERVICE_FALLBACKS[service.code || service.id] || '📱'}
                            alt={`Logo ${service.name}`}
                            className="w-8 h-8 rounded"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-bold text-lg ${
                                selectedService?.id === service.id ? 'text-green-700' : 'text-gray-900'
                              }`}>
                                {service.name}
                              </h4>
                              {isFrequentlyUsed('services', service.code || service.id) && (
                                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  FRÉQUENT
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              {index === 0 && !isFrequentlyUsed('services', service.code || service.id) && (
                                <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  POPULAIRE
                                </span>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mb-3 ${
                            selectedService?.id === service.id ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {service.description || `Numéro virtuel pour ${service.name}`}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-xl ${
                              selectedService?.id === service.id 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="font-bold text-lg">
                                {service.price.toFixed(0)} crédits
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {isLoading && selectedService?.id === service.id ? (
                                <>
                                  <LoadingSpinner size="sm" />
                                  <span className="text-sm text-gray-600">Achat...</span>
                                </>
                              ) : (
                                <svg className={`w-5 h-5 transition-colors ${
                                  selectedService?.id === service.id ? 'text-green-600' : 'text-gray-400 group-hover:text-purple-600'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions modernisées */}
        {selectedCountry && services.length > 0 && !isLoading && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">💡 Comment ça marche</h4>
                <div className="space-y-1 text-sm text-amber-800">
                  <p>✨ Cliquez sur le service de votre choix</p>
                  <p>⚡ L'achat se déclenche automatiquement</p>
                  <p>📱 Votre numéro virtuel sera prêt instantanément</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}