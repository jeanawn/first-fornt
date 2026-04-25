import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactions';
import { balanceService, type FedapayDeposit } from '../services/balance';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';
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
  usePageTitle(PAGE_TITLES.paymentConfirmation);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [fedapayDeposit, setFedapayDeposit] = useState<FedapayDeposit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes
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
        return false; // Continue polling
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

  const handleForceVerify = async () => {
    if (!fedapayDepositId || isVerifying) return;

    setIsVerifying(true);
    setError(null);

    try {
      const deposit = await balanceService.forceVerifyDepositStatus(fedapayDepositId);
      setFedapayDeposit(deposit);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
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
              Chargement...
            </h1>
          </div>
        </>
      );
    }

    if (fedapayDeposit?.status === 'approved') {
      return (
        <>
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
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
              Paiement non confirmé
            </h1>
            <p className="text-lg text-gray-600">
              Le paiement n'a pas été effectué ou a été annulé
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
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-orange-600">
            En attente de confirmation
          </h1>
          <p className="text-lg text-gray-600">
            Avez-vous effectué le paiement sur FedaPay ?
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
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-green-600">Paiement réussi !</h1>
            <p className="text-lg text-gray-600">
              Votre recharge de <strong>{Number(transaction.amount || 0).toFixed(2)} $</strong> a été confirmée
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
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
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
  const isPending = status === 'pending';
  const isSuccess = status === 'approved' || status === 'success';
  const isFailed = ['declined', 'canceled', 'failed'].includes(status);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {isFedapay ? renderFedapayContent() : renderLegacyContent()}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Détails FedaPay */}
          {isFedapay && fedapayDeposit && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Détails du paiement
                  </h3>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Montant USD</span>
                      <span className="font-bold text-orange-900 text-lg">{fedapayDeposit.amountUsd}$</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Montant XOF</span>
                      <span className="font-bold text-orange-900">{Number(fedapayDeposit.amountXof || 0).toLocaleString()} XOF</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Statut</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isSuccess ? 'bg-green-100 text-green-800' :
                        isFailed ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isSuccess ? 'Confirmé' :
                         status === 'declined' ? 'Refusé' :
                         status === 'canceled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions pour pending */}
                {isPending && (
                  <div className="space-y-3">
                    {/* Bouton vérifier */}
                    <button
                      onClick={handleForceVerify}
                      disabled={isVerifying}
                      className="w-full bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        {isVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Vérification...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Vérifier le paiement</span>
                          </>
                        )}
                      </div>
                    </button>

                    {/* Bouton ouvrir FedaPay */}
                    {fedapayPaymentUrl && (
                      <button
                        onClick={handleOpenPayment}
                        className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-2xl hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>Payer sur FedaPay</span>
                        </div>
                      </button>
                    )}

                    <p className="text-center text-sm text-gray-500">
                      Si vous avez déjà payé, cliquez sur "Vérifier le paiement"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bouton retour */}
          <div className="mt-8 space-y-4">
            <button
              onClick={onBackToDashboard}
              className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                isSuccess
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : isFailed
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
                <span>
                  {isSuccess ? 'Retour au tableau de bord' :
                   isFailed ? 'Retour au tableau de bord' :
                   'Retour (le paiement sera vérifié en arrière-plan)'}
                </span>
              </div>
            </button>

            {/* Countdown et status */}
            {isPending && (
              <div className="text-center">
                <p className="text-blue-600 text-sm mb-2">
                  Vérification automatique en cours...
                </p>
                <p className="text-gray-500 text-sm">
                  Temps restant: <span className="font-bold text-orange-600">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                </p>
              </div>
            )}
          </div>

          {/* Note sécurité */}
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
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
