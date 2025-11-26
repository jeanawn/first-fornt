import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import usePersistentTimer from '../hooks/usePersistentTimer';
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
    if (!operation) return 'from-gray-500 to-gray-600';

    switch (operation.status.toLowerCase()) {
      case 'processing': return 'from-blue-500 to-indigo-600';
      case 'pending': return 'from-yellow-500 to-amber-600';
      case 'success': return 'from-green-500 to-emerald-600';
      case 'failed': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = () => {
    if (!operation) return '';

    switch (operation.status.toLowerCase()) {
      case 'processing': return '🔄 En cours';
      case 'pending': return '⏳ En attente';
      case 'success': return '✅ Terminé';
      case 'failed': return '❌ Échec';
      default: return operation.status;
    }
  };

  const getStatusIcon = () => {
    if (!operation) return '';

    switch (operation.status.toLowerCase()) {
      case 'processing': return '🔄';
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '📱';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-8">
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
      <Layout>
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
              Détails de l'opération
            </h1>
            <p className="text-gray-600 text-sm">Créée le {formatDate(operation.createdDate)}</p>
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
              <div className="text-3xl">{getStatusIcon()}</div>
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
                  <span className="text-lg">🌍</span>
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
                    {operation.price && !isNaN(operation.price) ? `${operation.price} crédits` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Numéro (si disponible) */}
            {operation.number && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-900 font-medium mb-2">📞 Numéro de téléphone</p>
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
                    ✓ Numéro copié !
                  </p>
                )}
              </div>
            )}

            {/* Temps restant (si l'opération est en cours) */}
            {(operation.status.toLowerCase() === 'pending' || operation.status.toLowerCase() === 'processing') && !isExpired && (
              <div className="flex items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-center">
                  <p className="text-amber-900 font-medium mb-1">⏱️ Temps restant</p>
                  <p className="text-3xl font-mono font-bold text-amber-800">{timeRemaining}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code SMS (si disponible) */}
        {operation.sms ? (
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
        ) : operation.status.toLowerCase() === 'failed' ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="font-bold text-red-600 text-lg mb-1">Opération échouée</h4>
              <p className="text-red-500 text-sm">
                Aucun SMS n'a été reçu pour cette opération
              </p>
            </div>
          </div>
        ) : operation.status.toLowerCase() === 'pending' || operation.status.toLowerCase() === 'processing' ? (
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
                  ? '🔄 Attribution du numéro en cours...'
                  : '⚡ Vérification automatique du SMS...'
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