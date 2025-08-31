import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ImageWithFallback from '../components/ImageWithFallback';
import type { PhoneNumber } from '../types';

// Fallbacks
const COUNTRY_FALLBACKS: Record<string, string> = {
  'FR': '🇫🇷',
  'US': '🇺🇸', 
  'GB': '🇬🇧',
  'DE': '🇩🇪',
  'ES': '🇪🇸',
  'IT': '🇮🇹'
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

interface NumberDetailsProps {
  phoneNumber: PhoneNumber;
  onBack: () => void;
  onRefreshCode: () => void;
}

export default function NumberDetails({ phoneNumber, onBack, onRefreshCode }: NumberDetailsProps) {
  const [copied, setCopied] = useState<'number' | 'sms' | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  const copyToClipboard = (text: string, type: 'number' | 'sms') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Expiré';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCreationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mise à jour automatique du décompte toutes les secondes
  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(formatTimeRemaining(phoneNumber.expiresAt));
    };

    // Mise à jour immédiate
    updateTimer();

    // Mise à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [phoneNumber.expiresAt]);

  // Polling automatique pour les SMS toutes les 10 secondes si pas de SMS
  useEffect(() => {
    if (!phoneNumber.smsCode && phoneNumber.status === 'PENDING') {
      const pollInterval = setInterval(() => {
        onRefreshCode();
      }, 10000); // Toutes les 10 secondes

      // Arrêter le polling après 15 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 15 * 60 * 1000);

      return () => clearInterval(pollInterval);
    }
  }, [phoneNumber.smsCode, phoneNumber.status, onRefreshCode]);

  const getStatusColor = () => {
    switch (phoneNumber.status) {
      case 'PENDING': return 'from-yellow-500 to-amber-600';
      case 'SUCCESS': return 'from-green-500 to-emerald-600';
      case 'FAILED': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = () => {
    switch (phoneNumber.status) {
      case 'PENDING': return '⏳ En attente';
      case 'SUCCESS': return '✅ Terminé';
      case 'FAILED': return '❌ Échec';
      default: return phoneNumber.status;
    }
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
            <h1 className="text-2xl font-bold text-gray-900">
              Numéro virtuel 📱
            </h1>
            <p className="text-gray-600 text-sm">Créé le {formatCreationDate(phoneNumber.createdDate)}</p>
          </div>
        </div>

        {/* Statut */}
        <div className={`bg-gradient-to-r ${getStatusColor()} rounded-2xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Statut de l'opération</p>
              <p className="text-2xl font-bold">{getStatusText()}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Informations du numéro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Informations</h2>
              <p className="text-gray-600 text-sm">Détails du numéro virtuel</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Pays */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <ImageWithFallback
                    src={phoneNumber.country.flag}
                    fallback={COUNTRY_FALLBACKS[phoneNumber.country.code] || '🏳️'}
                    alt={`Drapeau ${phoneNumber.country.name}`}
                    className="w-6 h-4 rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pays</p>
                  <p className="text-gray-600 text-sm">{phoneNumber.country.name}</p>
                </div>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-lg">
                  <ImageWithFallback
                    src={phoneNumber.service.logoUrl}
                    fallback={SERVICE_FALLBACKS[phoneNumber.service.code || phoneNumber.service.id] || '📱'}
                    alt={`Logo ${phoneNumber.service.name}`}
                    className="w-6 h-6 rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service</p>
                  <p className="text-gray-600 text-sm">{phoneNumber.service.name}</p>
                </div>
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-900 font-medium mb-2">📞 Numéro de téléphone</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-mono font-bold text-blue-800">
                  {phoneNumber.number}
                </p>
                <button
                  onClick={() => copyToClipboard(phoneNumber.number, 'number')}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {copied === 'number' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied === 'number' && (
                <p className="text-blue-700 text-sm mt-2 font-medium">
                  ✓ Numéro copié !
                </p>
              )}
            </div>

            {/* Temps restant */}
            <div className="flex items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-center">
                <p className="text-amber-900 font-medium mb-1">⏱️ Temps restant</p>
                <p className="text-3xl font-mono font-bold text-amber-800">{timeRemaining}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code SMS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">Code SMS</h3>
              <p className="text-gray-600 text-sm">Code de vérification reçu</p>
            </div>
            {!phoneNumber.smsCode && phoneNumber.status === 'PENDING' && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>

          {phoneNumber.smsCode ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-green-900 font-bold text-lg mb-2">🎉 Code reçu !</h4>
                  <div className="bg-white rounded-xl p-4 border border-green-300">
                    <p className="text-4xl font-mono font-bold text-green-800 mb-2">
                      {phoneNumber.smsCode}
                    </p>
                    <button
                      onClick={() => copyToClipboard(phoneNumber.smsCode!, 'sms')}
                      className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {copied === 'sms' ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copier le code</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : phoneNumber.status === 'FAILED' ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="font-bold text-red-600 text-lg mb-1">Opération échouée</h4>
              <p className="text-red-500 text-sm">
                Aucun SMS n'a été reçu pour ce numéro
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">En attente du SMS</h4>
              <p className="text-blue-600 text-sm mb-4">
                ⚡ Vérification automatique toutes les 10 secondes
              </p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 max-w-xs mx-auto">
                <p className="text-blue-800 text-sm">
                  Le code apparaîtra automatiquement dès réception
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions modernisées */}
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
              <h4 className="font-semibold text-amber-900 mb-3">💡 Instructions d'utilisation</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-xs">1</span>
                  </div>
                  <p className="text-amber-800 text-sm">Copiez le numéro de téléphone ci-dessus</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-xs">2</span>
                  </div>
                  <p className="text-amber-800 text-sm">Utilisez-le pour vous inscrire sur {phoneNumber.service.name}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-xs">3</span>
                  </div>
                  <p className="text-amber-800 text-sm">Le code SMS apparaîtra automatiquement ici</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-xs">4</span>
                  </div>
                  <p className="text-amber-800 text-sm">Copiez et utilisez le code pour confirmer votre inscription</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}