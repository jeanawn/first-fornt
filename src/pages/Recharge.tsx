import { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import type { Network } from '../types';

interface RechargeProps {
  onRecharge: (amount: number, phoneNumber: string, network: Network) => void;
  onBack: () => void;
}

const NETWORKS: Network[] = [
  { id: 'yas_tg', name: 'Togocel' },
  { id: 'mtn_bj', name: 'MTN BENIN' },
  { id: 'moov_bj', name: 'MOOV BENIN' },
  { id: 'moov_tg', name: 'MOOV TOGO' },
  { id: 'orange_ci', name: 'ORANGE CI' },
  { id: 'mtn_ci', name: 'MTN CI' },
  { id: 'moov_ci', name: 'MOOV CI' },
  { id: 'orange_bf', name: 'ORANGE BF' },
  { id: 'telecel_bf', name: 'TELECEL BF' }
];

const NETWORK_COLORS: Record<string, string> = {
  'yas_tg': 'from-red-500 to-red-600',
  'mtn_bj': 'from-yellow-500 to-orange-600',
  'moov_bj': 'from-blue-500 to-blue-600',
  'moov_tg': 'from-green-500 to-green-600',
  'orange_ci': 'from-orange-500 to-orange-600',
  'mtn_ci': 'from-yellow-400 to-yellow-600',
  'moov_ci': 'from-blue-400 to-blue-600',
  'orange_bf': 'from-orange-600 to-red-500',
  'telecel_bf': 'from-purple-500 to-purple-600'
};

// Logos des réseaux mobiles
const NETWORK_LOGOS: Record<string, string> = {
  'yas_tg': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNkYzI2MjYiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPllBUzwvdGV4dD48L3N2Zz4=', // Togocel placeholder
  'mtn_bj': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmRkMDAiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1UTjwvdGV4dD48L3N2Zz4=', // MTN Benin
  'moov_bj': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDhiZjgiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1PT1Y8L3RleHQ+PC9zdmc+', // Moov Benin
  'moov_tg': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDhiZjgiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1PT1Y8L3RleHQ+PC9zdmc+', // Moov Togo
  'orange_ci': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZjY2MDAiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9SQU5HRTwvdGV4dD48L3N2Zz4=', // Orange CI
  'mtn_ci': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmRkMDAiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1UTjwvdGV4dD48L3N2Zz4=', // MTN CI
  'moov_ci': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDhiZjgiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1PT1Y8L3RleHQ+PC9zdmc+', // Moov CI
  'orange_bf': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZjY2MDAiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9SQU5HRTwvdGV4dD48L3N2Zz4=', // Orange BF
  'telecel_bf': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM4YjVjZjYiIHJ4PSIxMCIvPjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRFTEVDRUw8L3RleHQ+PHRleHQgeD0iNTAiIHk9IjY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFTTzwvdGV4dD48L3N2Zz4=' // Telecel BF
};

export default function Recharge({ onRecharge, onBack }: RechargeProps) {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNetworkId || !amount || !phoneNumber) return;

    const selectedNetwork = NETWORKS.find(n => n.id === selectedNetworkId);
    if (!selectedNetwork) return;

    setIsLoading(true);
    try {
      await onRecharge(parseFloat(amount), phoneNumber, selectedNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedAmounts = [1000, 5000, 100000, 200000];

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
              Recharge 💳
            </h1>
            <p className="text-gray-600 text-sm">Ajoutez des crédits à votre compte</p>
          </div>
        </div>

        {/* Carte d'information moderne */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">💡 Information importante</h4>
              <p className="text-sm text-blue-800">
                <strong>1 crédit = 1 FCFA</strong><br/>
                Les crédits servent à acheter des numéros virtuels sur la plateforme.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sélection du montant modernisée */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Montant à recharger</h3>
            </div>
            
            {/* Montants suggérés */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {suggestedAmounts.map((suggestedAmount) => (
                <button
                  key={suggestedAmount}
                  type="button"
                  onClick={() => setAmount(suggestedAmount.toString())}
                  className={`group p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                    amount === suggestedAmount.toString()
                      ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className={`text-lg font-bold ${
                    amount === suggestedAmount.toString() ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {suggestedAmount.toLocaleString()}
                  </div>
                  <div className={`text-xs font-medium ${
                    amount === suggestedAmount.toString() ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    crédits
                  </div>
                </button>
              ))}
            </div>

            {/* Input personnalisé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou saisir un montant personnalisé
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 50000"
                min="1"
                step="1"
                required
                className="text-center text-lg font-semibold"
              />
              
              {/* Affichage de l'équivalent */}
              {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl">
                    <span className="text-sm text-blue-700">Équivalent :</span>
                    <span className="font-bold text-blue-800">{parseFloat(amount).toLocaleString()} crédits</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations de paiement */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Informations de paiement</h3>
            </div>

            {/* Numéro de téléphone */}
            <div>
              <Input
                type="tel"
                label="Numéro de téléphone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: 070343222121"
                required
              />
            </div>

            {/* Sélection du réseau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Réseau mobile
              </label>
              <div className="relative">
                <select
                  value={selectedNetworkId}
                  onChange={(e) => setSelectedNetworkId(e.target.value)}
                  required
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-gray-900 font-medium bg-white appearance-none cursor-pointer hover:border-purple-300"
                >
                  <option value="">Sélectionnez votre réseau mobile</option>
                  <optgroup label="🇹🇬 TOGO">
                    <option value="yas_tg">Togocel</option>
                    <option value="moov_tg">MOOV TOGO</option>
                  </optgroup>
                  <optgroup label="🇧🇯 BÉNIN">
                    <option value="mtn_bj">MTN BENIN</option>
                    <option value="moov_bj">MOOV BENIN</option>
                  </optgroup>
                  <optgroup label="🇨🇮 CÔTE D'IVOIRE">
                    <option value="orange_ci">ORANGE CI</option>
                    <option value="mtn_ci">MTN CI</option>
                    <option value="moov_ci">MOOV CI</option>
                  </optgroup>
                  <optgroup label="🇧🇫 BURKINA FASO">
                    <option value="orange_bf">ORANGE BF</option>
                    <option value="telecel_bf">TELECEL BF</option>
                  </optgroup>
                </select>
                
                {/* Icône flèche personnalisée */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Indicateur visuel du réseau sélectionné */}
                {selectedNetworkId && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <img 
                          src={NETWORK_LOGOS[selectedNetworkId]}
                          alt={`Logo ${NETWORKS.find(n => n.id === selectedNetworkId)?.name}`}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <span className="text-primary-800 font-semibold font-montserrat">
                        {NETWORKS.find(n => n.id === selectedNetworkId)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Résumé moderne */}
          {amount && phoneNumber && selectedNetworkId && (
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
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
                  <span className="font-bold text-lg text-green-600">{amount} crédits</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Téléphone</span>
                  <span className="font-medium text-gray-900">{phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Réseau</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${
                      NETWORK_COLORS[selectedNetworkId] || 'from-gray-500 to-gray-600'
                    }`}></div>
                    <span className="font-medium text-gray-900">
                      {NETWORKS.find(n => n.id === selectedNetworkId)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bouton de confirmation moderne */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !amount || !phoneNumber || !selectedNetworkId}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
            >
              <div className="flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Confirmer la recharge</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}