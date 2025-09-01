import { useState, useEffect } from 'react';
import type { User, Transaction } from '../types';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { operationsService } from '../services/operations';
import { transactionService } from '../services/transactions';
import type { Operation } from '../services/operations';

// Fallbacks pour les services 
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

interface DashboardProps {
  user: User;
  onRecharge: () => void;
  onBuyNumber: () => void;
  onLogout: () => void;
}

export default function Dashboard({ user, onRecharge, onBuyNumber, onLogout }: DashboardProps) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingOperations, setIsLoadingOperations] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [copiedSms, setCopiedSms] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'operations' | 'transactions'>('operations');

  // Charger les opérations récentes
  useEffect(() => {
    const loadOperations = async () => {
      try {
        const userOperations = await operationsService.getUserOperations();
        // Trier par date décroissante et prendre les 5 plus récentes
        const sortedOperations = userOperations
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .slice(0, 5);
        setOperations(sortedOperations);
      } catch {
        
      } finally {
        setIsLoadingOperations(false);
      }
    };

    loadOperations();
  }, []);

  // Charger les transactions récentes
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const recentTransactions = await transactionService.getRecentTransactions(3);
        setTransactions(recentTransactions || []);
      } catch {
        
        // En cas d'erreur, on ignore silencieusement et on continue sans les transactions
        setTransactions([]);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    // Seulement essayer de charger les transactions si le service est disponible
    if (transactionService && typeof transactionService.getRecentTransactions === 'function') {
      loadTransactions();
    } else {
      console.warn('Service transactions non disponible');
      setIsLoadingTransactions(false);
      setTransactions([]);
    }
  }, []);
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return '✅ Terminé';
      case 'failed': return '❌ Échec';
      case 'pending': return '⏳ En attente';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Aujourd\'hui';
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const copySmsToClipboard = (sms: string, operationId: string) => {
    navigator.clipboard.writeText(sms).then(() => {
      setCopiedSms(operationId);
      setTimeout(() => setCopiedSms(null), 2000);
    });
  };

  // Fonctions utilitaires pour les transactions
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💳';
      case 'refund': return '↩️';
      case 'withdraw': return '💰';
      default: return '💱';
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit': return 'Recharge';
      case 'refund': return 'Remboursement';
      case 'withdraw': return 'Retrait';
      default: return 'Transaction';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format dd/mm/yy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-md mx-auto">
        {/* Header avec salutation personnalisée */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-gray-200 p-2">
            <img 
              src="https://s6.imgcdn.dev/YQjTwD.png" 
              alt="TagaNum Logo" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-montserrat">
              Bonjour {user.username ? user.username : user.email} ! 👋
            </h1>
          </div>
        </div>

        {/* Balance Card - Design épuré avec couleurs custom */}
        <div className="bg-gradient-to-br from-primary to-primary-800 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-white/80 text-sm font-montserrat font-medium">Solde disponible</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-4xl font-montserrat font-bold text-white">
              {user.balance.toFixed(0).toLocaleString()}
            </p>
            <p className="text-white/80 text-lg font-montserrat font-medium">crédits</p>
          </div>
        </div>

        {/* Action Buttons - Design avec cartes cliquables */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onRecharge}
            className="group bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-secondary rounded-xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-gray-900 text-sm">Recharger</p>
                <p className="font-montserrat text-xs text-gray-600">Ajouter des crédits</p>
              </div>
            </div>
          </button>

          <button
            onClick={onBuyNumber}
            className="group bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-gray-900 text-sm">Acheter</p>
                <p className="font-montserrat text-xs text-gray-600">Numéro virtuel</p>
              </div>
            </div>
          </button>
        </div>

        {/* Activity Card - Operations et Transactions combinées */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Header avec switch */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Activité récente
              </h3>
            </div>
            
            {/* Switch Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('operations')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'operations'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📱 Opérations
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'transactions'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  💳 Transactions
                </button>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {activeTab === 'operations' ? operations.length : transactions.length}
              </div>
            </div>
          </div>
          
          {/* Contenu conditionnel selon l'onglet */}
          {activeTab === 'operations' ? (
            /* Affichage des Opérations */
            isLoadingOperations ? (
              <div className="text-center py-8">
                <LoadingSpinner size="md" />
                <p className="mt-3 text-gray-600">Chargement...</p>
              </div>
            ) : operations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Aucune opération</h4>
                <p className="text-gray-500 text-sm">Vos numéros virtuels apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {operations.map((operation, index) => (
                <div
                  key={operation.id}
                  className={`relative bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 group ${
                    index === 0 ? 'ring-2 ring-blue-100 bg-gradient-to-r from-blue-50 to-white' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-medium shadow-sm group-hover:scale-105 transition-transform">
                        {SERVICE_FALLBACKS[operation.service?.toLowerCase()] || '📱'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {operation.service}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          operation.status.toLowerCase() === 'success' ? 'bg-green-100 text-green-800' :
                          operation.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getStatusText(operation.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {operation.country} • {operation.number}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDate(operation.createdDate)}
                        </p>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-700">
                            {operation.price && !isNaN(operation.price) ? operation.price + ' crédits' : '—'}
                          </p>
                        </div>
                      </div>
                      {operation.status.toLowerCase() === 'success' && operation.sms && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 mt-3 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-green-800">📱 SMS reçu</p>
                            <button
                              onClick={() => copySmsToClipboard(operation.sms!, operation.id)}
                              className="p-1 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              title="Copier le SMS"
                            >
                              {copiedSms === operation.id ? (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-lg font-bold text-green-800 bg-white/50 px-3 py-2 rounded-lg border">
                            {operation.sms}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )
          ) : (
            /* Affichage des Transactions */
            isLoadingTransactions ? (
              <div className="text-center py-8">
                <LoadingSpinner size="md" />
                <p className="mt-3 text-gray-600">Chargement des transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Aucune transaction</h4>
                <p className="text-gray-500 text-sm">Vos transactions apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg group-hover:scale-105 transition-transform">
                        {getTransactionTypeIcon(transaction.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {getTransactionTypeText(transaction.type)}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionStatusColor(transaction.status)}`}>
                            {transaction.status === 'success' ? '✓' : 
                             transaction.status === 'failed' ? '✗' : '○'}
                          </span>
                        </div>
                        {transaction.network && (
                          <p className="text-xs text-gray-500 truncate">
                            {transaction.network.replace('_', ' ').toUpperCase()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatTransactionDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 
                        transaction.type === 'refund' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : 
                         transaction.type === 'refund' ? '+' : '-'}{transaction.amount} crédits
                      </p>
                      {transaction.reference && transaction.reference !== 'N/A' && (
                        <p className="text-xs text-gray-500 font-mono">
                          #{transaction.reference.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Logout Button - Design discret */}
        <div className="pt-6 pb-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-red-600 transition-all duration-200 border border-gray-200 hover:border-red-200 group"
          >
            <svg className="w-4 h-4 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}