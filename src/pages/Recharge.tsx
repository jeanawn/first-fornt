import { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import { balanceService } from '../services/balance';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';

interface RechargeProps {
  onRecharge: (depositId: string, paymentUrl: string) => void;
  onBack: () => void;
}

export default function Recharge({ onRecharge, onBack }: RechargeProps) {
  usePageTitle(PAGE_TITLES.recharge);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedAmounts = [1000, 5000, 10000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum < 500) {
      setError('Veuillez entrer un montant valide (minimum 500 FCFA)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await balanceService.createFedapayDeposit({
        amount: amountNum,
        description: `Recharge de ${amountNum} FCFA`,
      });

      if (response.success && response.paymentUrl) {
        onRecharge(response.depositId, response.paymentUrl);
      } else {
        setError('Erreur lors de la création du paiement');
      }
    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.message || 'Erreur lors de la création du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showBottomNav>
      <div className="space-y-8 max-w-md mx-auto">
        {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900">Recharger</h1>
            <p className="text-gray-600 text-sm">Ajoutez du solde à votre compte</p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Information</h4>
              <p className="text-sm text-blue-800">
                Entrez le montant en <strong>FCFA</strong> que vous souhaitez recharger.
                Vous serez redirigé vers FedaPay pour effectuer le paiement.
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Montant à recharger</h3>
            </div>

            {/* Suggested amounts */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {suggestedAmounts.map((suggestedAmount) => (
                <button
                  key={suggestedAmount}
                  type="button"
                  onClick={() => setAmount(suggestedAmount.toString())}
                  className={`group p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                    amount === suggestedAmount.toString()
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className={`text-lg font-bold ${
                    amount === suggestedAmount.toString() ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {suggestedAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">FCFA</div>
                </button>
              ))}
            </div>

            {/* Custom amount input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou saisir un montant personnalisé (FCFA)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 2000"
                min="500"
                step="100"
                required
                className="text-center text-lg font-semibold"
              />
            </div>
          </div>

          {/* Summary */}
          {amount && parseFloat(amount) >= 500 && (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Récapitulatif</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-bold text-lg text-green-600">{parseFloat(amount).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-3">
                  <span className="text-gray-600">Crédit sur votre compte</span>
                  <span className="font-bold text-lg text-blue-600">{parseFloat(amount).toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !amount || parseFloat(amount) < 500}
              className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
            >
              <div className="flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Redirection vers FedaPay...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Payer avec FedaPay</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* FedaPay info */}
          <div className="text-center text-sm text-gray-500">
            <p>Paiement sécurisé via FedaPay</p>
            <p className="mt-1">Mobile Money accepté (MTN, Moov, Orange...)</p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
