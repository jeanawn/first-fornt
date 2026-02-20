import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactions';
import { balanceService, type FedapayDeposit } from '../services/balance';
import type { Transaction } from '../types';

interface PaymentConfirmationProps {
  transactionId?: string | null;
  fedapayDepositId?: string;
  fedapayPaymentUrl?: string;
  onBackToDashboard: () => void;
}

export default function PaymentConfirmation({
  transactionId,
  fedapayDepositId,
  fedapayPaymentUrl,
  onBackToDashboard
}: PaymentConfirmationProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [fedapayDeposit, setFedapayDeposit] = useState<FedapayDeposit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(120); // 2 minutes pour FedaPay
  const [error, setError] = useState<string | null>(null);

  const isFedapay = !!fedapayDepositId;

  // Polling FedaPay
  useEffect(() => {
    if (!fedapayDepositId) return;

    const pollDeposit = async () => {
      try {
        const deposit = await balanceService.checkFedapayDepositStatus(fedapayDepositId);
        setFedapayDeposit(deposit);
        setIsLoading(false);

        // Si paiement finalisé, arrêter le polling
        if (['approved', 'declined', 'canceled', 'refunded'].includes(deposit.status)) {
          return true;
        }
        return false;
      } catch {
        setError('Erreur lors de la vérification du statut');
        setIsLoading(false);
        return true;
      }
    };

    // Premier appel
    pollDeposit();

    // Polling toutes les 5 secondes
    const pollInterval = setInterval(async () => {
      const shouldStop = await pollDeposit();
      if (shouldStop) {
        clearInterval(pollInterval);
      }
    }, 5000);

    // Countdown
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          clearInterval(pollInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownTimer);
    };
  }, [fedapayDepositId]);

  // Polling legacy (transactionId)
  useEffect(() => {
    if (!transactionId || isFedapay) return;

    const pollTransaction = async () => {
      try {
        const txn = await transactionService.getTransactionById(transactionId);
        if (txn) {
          setTransaction(txn);
          setIsLoading(false);

          if (txn.status === 'success' || txn.status === 'failed') {
            return true;
          }
        }
        return false;
      } catch {
        setError('Erreur lors de la vérification du statut');
        setIsLoading(false);
        return true;
      }
    };

    pollTransaction();

    const pollInterval = setInterval(async () => {
      const shouldStop = await pollTransaction();
      if (shouldStop) {
        clearInterval(pollInterval);
      }
    }, 3000);

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
  }, [transactionId, isFedapay, onBackToDashboard]);

  const handleOpenPayment = () => {
    if (fedapayPaymentUrl) {
      window.open(fedapayPaymentUrl, '_blank');
    }
  };

  // Rendu FedaPay
  const renderFedapayContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Vérification du paiement...
            </h1>
            <p className="text-lg text-gray-600">
              Effectuez votre paiement sur FedaPay
            </p>
          </div>
        </>
      );
    }

    if (error) {
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
            <h1 className="text-3xl font-bold text-red-600">Erreur</h1>
            <p className="text-lg text-gray-600">{error}</p>
          </div>
        </>
      );
    }

    if (fedapayDeposit?.status === 'approved') {
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
            <h1 className="text-3xl font-bold text-green-600">
              Paiement réussi !
            </h1>
            <p className="text-lg text-gray-600">
              Votre compte a été crédité de <strong>{fedapayDeposit.amountUsd}$</strong>
            </p>
          </div>
        </>
      );
    }

    if (['declined', 'canceled'].includes(fedapayDeposit?.status || '')) {
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
            <h1 className="text-3xl font-bold text-red-600">
              Paiement échoué
            </h1>
            <p className="text-lg text-gray-600">
              Le paiement n'a pas pu être traité
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
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping"></div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-orange-600">
            En attente de paiement
          </h1>
          <p className="text-lg text-gray-600">
            Complétez votre paiement sur FedaPay
          </p>
        </div>
      </>
    );
  };

  // Rendu Legacy
  const renderLegacyContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Vérification du paiement...
            </h1>
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
            <h1 className="text-3xl font-bold text-red-600">Erreur</h1>
            <p className="text-lg text-gray-600">{error || 'Transaction introuvable'}</p>
          </div>
        </>
      );
    }

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
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-green-600">Paiement réussi !</h1>
            <p className="text-lg text-gray-600">
              Votre recharge de <strong>{transaction.amount.toFixed(2)} $</strong> a été confirmée
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
            <h1 className="text-3xl font-bold text-red-600">Paiement échoué</h1>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-blue-600">Paiement en cours...</h1>
        </div>
      </>
    );
  };

  const getStatus = () => {
    if (isFedapay) {
      return fedapayDeposit?.status || 'pending';
    }
    return transaction?.status || 'pending';
  };

  const status = getStatus();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {isFedapay ? renderFedapayContent() : renderLegacyContent()}

          {/* Détails FedaPay */}
          {isFedapay && fedapayDeposit && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Détails du paiement
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Montant USD</span>
                      <span className="font-bold text-orange-900 text-lg">{fedapayDeposit.amountUsd}$</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Montant XOF</span>
                      <span className="font-bold text-orange-900">{fedapayDeposit.amountXof.toLocaleString()} XOF</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Statut</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === 'approved' ? 'bg-green-100 text-green-800' :
                        ['declined', 'canceled'].includes(status) ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {status === 'approved' ? 'Confirmé' :
                         status === 'declined' ? 'Refusé' :
                         status === 'canceled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton pour rouvrir FedaPay */}
                {status === 'pending' && fedapayPaymentUrl && (
                  <button
                    onClick={handleOpenPayment}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Ouvrir FedaPay</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bouton retour */}
          <div className="mt-8 space-y-4">
            <button
              onClick={onBackToDashboard}
              className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                status === 'approved' || status === 'success'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  : ['declined', 'canceled', 'failed'].includes(status)
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
                <span>Retour au tableau de bord</span>
              </div>
            </button>

            {/* Countdown */}
            {status === 'pending' && (
              <div className="text-center">
                <p className="text-orange-600 text-sm mb-2">
                  Vérification automatique toutes les 5 secondes
                </p>
                <p className="text-gray-500 text-sm">
                  Temps restant: <span className="font-bold text-orange-600">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                </p>
              </div>
            )}
          </div>

          {/* Note sécurité */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-green-800 text-sm font-medium">
                {isFedapay ? 'Paiement sécurisé via FedaPay' : 'Transaction sécurisée'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
