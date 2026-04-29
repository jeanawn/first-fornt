import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import usePersistentTimer from '../hooks/usePersistentTimer';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';
import { operationsService } from '../services/operations';
import type { Operation } from '../services/operations';

// Fallbacks
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

interface OperationDetailsProps {
  operationId: string;
  onBack: () => void;
}

export default function OperationDetails({ operationId, onBack }: OperationDetailsProps) {
  usePageTitle(PAGE_TITLES.operationDetails);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<'number' | 'sms' | null>(null);

  // Timer persistant pour l'opération
  const { timeRemaining, isExpired, clearTimer } = usePersistentTimer(
    operationId,
    operation?.createdDate || new Date().toISOString(),
    15
  );

  useEffect(() => {
    const loadOperation = async () => {
      try {
        const op = await operationsService.getOperationById(operationId);
        setOperation(op);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'opération:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOperation();
  }, [operationId]);

  // Nettoyage du timer quand l'opération est terminée
  useEffect(() => {
    if (operation && (operation.sms || operation.status.toLowerCase() === 'success' || operation.status.toLowerCase() === 'failed')) {
      clearTimer();
    }
  }, [operation, clearTimer]);

  const copyToClipboard = (text: string, type: 'number' | 'sms') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (!operation) return 'bg-gray-500';

    switch (operation.status.toLowerCase()) {
      case 'processing': return 'bg-blue-600';
      case 'pending': return 'bg-amber-500';
      case 'success': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!operation) return '';

    switch (operation.status.toLowerCase()) {
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      case 'success': return 'Terminé';
      case 'failed': return 'Échec';
      default: return operation.status;
    }
  };

  const getStatusIcon = () => {
    if (!operation) return null;

    switch (operation.status.toLowerCase()) {
      case 'processing': return (
        <svg className="w-7 h-7 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
      case 'pending': return (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'success': return (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'failed': return (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
      default: return (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <Layout showBottomNav>
        <div className="space-y-8 max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Détails</h1>
          </div>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Chargement des détails...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!operation) {
    return (
      <Layout showBottomNav>
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h4 className="font-bold text-red-600 text-lg mb-2">Opération introuvable</h4>
            <p className="text-red-500 text-sm mb-6">
              Cette opération n'existe pas ou vous n'avez pas accès
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBottomNav>
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
              Détails de l'opération
            </h1>
            <p className="text-gray-600 text-sm">Créée le {formatDate(operation.createdDate)}</p>
          </div>
        </div>

        {/* Statut */}
        <div className={`${getStatusColor()} rounded-2xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Statut de l'opération</p>
              <p className="text-2xl font-bold">{getStatusText()}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              {getStatusIcon()}
            </div>
          </div>
        </div>

        {/* Informations de l'opération */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Informations</h2>
              <p className="text-gray-600 text-sm">Détails de votre opération</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Service */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-lg">
                  {SERVICE_FALLBACKS[operation.service?.toLowerCase()] || '📱'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service</p>
                  <p className="text-gray-600 text-sm">{operation.service}</p>
                </div>
              </div>
            </div>

            {/* Pays */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pays</p>
                  <p className="text-gray-600 text-sm">{operation.country}</p>
                </div>
              </div>
            </div>

            {/* Prix */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Prix</p>
                  <p className="text-gray-600 text-sm">
                    {operation.price && !isNaN(operation.price) ? `${operation.price.toLocaleString()} FCFA` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Numéro (si disponible) */}
            {operation.number && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-blue-900 font-medium">Numéro de téléphone</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-mono font-bold text-blue-800">
                    {operation.number}
                  </p>
                  <button
                    onClick={() => copyToClipboard(operation.number, 'number')}
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
                    Numéro copié
                  </p>
                )}
              </div>
            )}

            {/* Temps restant (si l'opération est en cours) */}
            {(operation.status.toLowerCase() === 'pending' || operation.status.toLowerCase() === 'processing') && !isExpired && (
              <div className="flex items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-amber-900 font-medium">Temps restant</p>
                  </div>
                  <p className="text-3xl font-mono font-bold text-amber-800">{timeRemaining}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code SMS (si disponible et statut SUCCESS) */}
        {operation.sms && operation.status.toLowerCase() !== 'failed' ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Code SMS</h3>
                <p className="text-gray-600 text-sm">Code de vérification reçu</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-green-900 font-bold text-lg mb-2">Code reçu</h4>
                  <div className="bg-white rounded-xl p-4 border border-green-300">
                    <p className="text-4xl font-mono font-bold text-green-800 mb-2">
                      {operation.sms}
                    </p>
                    <button
                      onClick={() => copyToClipboard(operation.sms!, 'sms')}
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
          </div>
        ) : (operation.status.toLowerCase() === 'pending' || operation.status.toLowerCase() === 'processing') ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">
                {operation.status.toLowerCase() === 'processing' ? 'Traitement en cours' : 'En attente du SMS'}
              </h4>
              <p className="text-blue-600 text-sm mb-4">
                {operation.status.toLowerCase() === 'processing'
                  ? 'Attribution du numéro en cours...'
                  : 'Vérification automatique du SMS...'
                }
              </p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 max-w-xs mx-auto">
                <p className="text-blue-800 text-sm">
                  {operation.status.toLowerCase() === 'processing'
                    ? 'Le numéro sera attribué automatiquement'
                    : 'Le code apparaîtra automatiquement dès réception'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* ID de l'opération */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">ID de l'opération</p>
              <p className="text-gray-900 font-mono text-sm">{operation.id}</p>
            </div>
            <button
              onClick={() => copyToClipboard(operation.id, 'number')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copier l'ID"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}