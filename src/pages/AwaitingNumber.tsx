import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageWithFallback from '../components/ImageWithFallback';
import type { Country, Service } from '../types';

// Fallbacks pour les pays et services
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
  'CH': '🇨🇭'
};

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

interface AwaitingNumberProps {
  country: Country;
  service: Service;
  onBack: () => void;
}

export default function AwaitingNumber({ country, service, onBack }: AwaitingNumberProps) {
  const [dots, setDots] = useState('');

  // Animation des points
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="space-y-8 max-w-md mx-auto">
        {/* Header avec bouton retour */}
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
            <h1 className="text-2xl font-bold text-gray-900">
              Préparation en cours 📱
            </h1>
            <p className="text-gray-600 text-sm">Obtention du numéro virtuel</p>
          </div>
        </div>

        {/* Statut en cours */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
              <LoadingSpinner size="md" color="white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">🔄 Opération en cours</p>
              <p className="text-2xl font-bold">Obtention du numéro{dots}</p>
              <p className="text-white/90 text-sm mt-2">Cela peut prendre quelques instants</p>
            </div>
          </div>
        </div>

        {/* Informations de la commande */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Votre commande</h2>
              <p className="text-gray-600 text-sm">Détails de l'achat en cours</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Pays */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <ImageWithFallback
                    src={country.flags || country.flag}
                    fallback={COUNTRY_FALLBACKS[country.alphaCode || country.code] || '🏳️'}
                    alt={`Drapeau ${country.name}`}
                    className="w-6 h-4 rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pays</p>
                  <p className="text-gray-600 text-sm">{country.name}</p>
                </div>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-lg">
                  <ImageWithFallback
                    src={service.logoUrl}
                    fallback={SERVICE_FALLBACKS[service.code || service.id] || '📱'}
                    alt={`Logo ${service.name}`}
                    className="w-6 h-6 rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service</p>
                  <p className="text-gray-600 text-sm">{service.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{service.price} crédits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">⚡ Étapes en cours</h4>
              <div className="space-y-2 text-sm text-amber-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p>✓ Commande validée</p>
                </div>
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="xs" />
                  <p>🔄 Attribution du numéro en cours</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <p className="text-amber-600">⏳ En attente du SMS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information rassurante */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">🛡️ Garantie automatique</h4>
              <p className="text-green-800 text-sm">
                Si aucun numéro n'est attribué dans les 5 prochaines minutes,
                vos crédits seront automatiquement remboursés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}