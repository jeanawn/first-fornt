import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactions';
import type { Transaction } from '../types';

interface PaymentConfirmationProps {
  transactionId: string;
  onBackToDashboard: () => void;
}

export default function PaymentConfirmation({ 
  transactionId, 
  onBackToDashboard 
}: PaymentConfirmationProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(60); // 60 secondes max
  const [error, setError] = useState<string | null>(null);

  // Polling de la transaction
  useEffect(() => {
    const pollTransaction = async () => {
      try {
        const txn = await transactionService.getTransactionById(transactionId);
        setTransaction(txn);
        setIsLoading(false);
        
        // Si transaction finalisée (success ou failed), arrêter le polling
        if (txn.status === 'success' || txn.status === 'failed') {
          return true; // Arrêter le polling
        }
        return false; // Continuer le polling
      } catch (error) {
        console.error('Erreur polling transaction:', error);
        setError('Erreur lors de la vérification du statut');
        setIsLoading(false);
        return true; // Arrêter le polling en cas d'erreur
      }
    };

    // Premier appel immédiat
    pollTransaction();

    // Polling toutes les 3 secondes
    const pollInterval = setInterval(async () => {
      const shouldStop = await pollTransaction();
      if (shouldStop) {
        clearInterval(pollInterval);
      }
    }, 3000);

    // Countdown pour retour automatique
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          clearInterval(pollInterval);
          onBackToDashboard();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownTimer);
    };
  }, [transactionId, onBackToDashboard]);

  // Rendu conditionnel selon le statut
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
              Vérification du paiement...
            </h1>
            <p className="text-lg text-gray-600 font-montserrat">
              Récupération des informations de transaction
            </p>
          </div>
        </>
      );
    }

    if (error || !transaction) {
      return (
        <>
          <div className="text-center">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-red-600 font-montserrat">
              Erreur
            </h1>
            <p className="text-lg text-gray-600 font-montserrat">
              {error || 'Transaction introuvable'}
            </p>
          </div>
        </>
      );
    }

    // Affichage selon le statut de la transaction
    if (transaction.status === 'success') {
      return (
        <>
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping"></div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-green-600 font-montserrat">
              🎉 Paiement réussi !
            </h1>
            <p className="text-lg text-gray-600 font-montserrat">
              Votre recharge de <strong>{transaction.amount} crédits</strong> a été confirmée
            </p>
          </div>
        </>
      );
    }

    if (transaction.status === 'failed') {
      return (
        <>
          <div className="text-center">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-red-600 font-montserrat">
              ❌ Paiement échoué
            </h1>
            <p className="text-lg text-gray-600 font-montserrat">
              Le paiement de {transaction.amount} crédits n'a pas pu être traité
            </p>
          </div>
        </>
      );
    }

    // Status pending
    return (
      <>
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping"></div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-blue-600 font-montserrat">
            ⏳ Paiement en cours...
          </h1>
          <p className="text-lg text-gray-600 font-montserrat">
            Vérification du paiement de <strong>{transaction.amount} crédits</strong>
          </p>
        </div>
      </>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {renderContent()}

          {/* Détails de transaction */}
          {transaction && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-3">
                    📋 Détails de la transaction
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">ID Transaction</span>
                      <span className="font-mono text-blue-900 text-sm">#{transactionId.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Montant</span>
                      <span className="font-bold text-blue-900 text-lg">{transaction.amount} crédits</span>
                    </div>
                    {transaction.phoneNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Téléphone</span>
                        <span className="font-mono text-blue-900">{transaction.phoneNumber}</span>
                      </div>
                    )}
                    {transaction.network && (
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Réseau</span>
                        <span className="font-semibold text-blue-900">{transaction.network.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Statut</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status === 'success' ? '✅ Confirmé' :
                         transaction.status === 'failed' ? '❌ Échec' : '⏳ En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {transaction.status === 'pending' && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">💡 Instructions</h4>
                        <div className="space-y-2 text-sm text-amber-800">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-amber-800 font-bold text-xs">1</span>
                            </div>
                            <p>Vérifiez votre téléphone {transaction.phoneNumber}</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-amber-800 font-bold text-xs">2</span>
                            </div>
                            <p>Composez le code proposé ou confirmez avec votre PIN</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-amber-800 font-bold text-xs">3</span>
                            </div>
                            <p>Le statut sera mis à jour automatiquement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="mt-8 space-y-4">
            <button
              onClick={onBackToDashboard}
              className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                transaction?.status === 'success' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  : transaction?.status === 'failed'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
                <span>
                  {transaction?.status === 'success' ? 'Retour au tableau de bord' :
                   transaction?.status === 'failed' ? 'Retour au tableau de bord' :
                   'Forcer le retour'}
                </span>
              </div>
            </button>
            
            {/* Compteur automatique et statut */}
            <div className="text-center">
              {transaction?.status === 'pending' ? (
                <>
                  <p className="text-blue-600 text-sm font-montserrat mb-2">
                    🔄 Vérification en cours... (toutes les 3 secondes)
                  </p>
                  <p className="text-gray-500 text-sm font-montserrat">
                    Timeout automatique dans <span className="font-bold text-primary">{countdown}s</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${((60 - countdown) / 60) * 100}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm font-montserrat">
                  Redirection automatique dans <span className="font-bold text-primary">{countdown}s</span>
                </p>
              )}
            </div>
          </div>

          {/* Note de sécurité */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-green-800 text-sm font-medium font-montserrat">
                🔐 {transaction?.status === 'pending' ? 'Vérification' : 'Transaction'} sécurisée par votre opérateur mobile
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}