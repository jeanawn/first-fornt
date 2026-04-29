import { useState, useEffect } from 'react';
import type { User, Transaction } from '../types';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { operationsService } from '../services/operations';
import { transactionService } from '../services/transactions';
import type { Operation } from '../services/operations';
import { useTranslation } from '../i18n';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';

interface DashboardProps {
  user: User;
  onRecharge: () => void;
  onBuyNumber: () => void;
  onLogout: () => void;
  onViewOperation?: (operationId: string) => void;
  onGoToAdmin?: () => void;
}

export default function Dashboard({ user, onRecharge, onBuyNumber, onLogout, onViewOperation, onGoToAdmin }: DashboardProps) {
  const { t, language } = useTranslation();
  usePageTitle(PAGE_TITLES.dashboard);
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
        // Ignore errors silently
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
      case 'processing': return t.dashboard.status.processing;
      case 'success': return t.dashboard.status.success;
      case 'failed': return t.dashboard.status.failed;
      case 'pending': return t.dashboard.status.pending;
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return language === 'fr' ? 'Aujourd\'hui' : 'Today';
    } else if (days === 1) {
      return language === 'fr' ? 'Hier' : 'Yesterday';
    } else if (days < 7) {
      return language === 'fr' ? `Il y a ${days} jours` : `${days} days ago`;
    } else {
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
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
      case 'deposit': return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
      case 'refund': return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      );
      case 'withdraw': return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4M4 12h16" />
        </svg>
      );
      default: return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit': return language === 'fr' ? 'Recharge' : 'Top up';
      case 'refund': return language === 'fr' ? 'Remboursement' : 'Refund';
      case 'withdraw': return language === 'fr' ? 'Retrait' : 'Withdrawal';
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
    <Layout showBottomNav>
      <div className="space-y-6 max-w-md mx-auto">
        {/* Header salutation */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold font-montserrat mb-0.5">
              {t.dashboard.balance !== undefined ? (language === 'fr' ? 'Bonjour' : 'Hello') : 'Hello'}
            </p>
            <h1 className="text-lg font-bold text-gray-900 font-montserrat leading-tight">
              {user.username ? user.username : user.email}
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 transition-colors"
            title={t.dashboard.logout}
          >
            <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5 font-montserrat">
                {t.dashboard.balance}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-white font-montserrat">
                  {Number(user.balance || 0).toLocaleString()}
                </span>
                <span className="text-2xl font-medium text-gray-500 font-montserrat">FCFA</span>
              </div>
            </div>
            <button
              onClick={onRecharge}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors font-montserrat"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.dashboard.recharge}
            </button>
          </div>
        </div>

        {/* Buy Number */}
        <button
          onClick={onBuyNumber}
          className="w-full group flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm font-montserrat">{t.dashboard.buyNumber}</p>
              <p className="text-xs text-gray-500 font-montserrat">{language === 'fr' ? 'Numéro virtuel SMS' : 'Virtual SMS number'}</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Admin Button - Only for admins */}
        {onGoToAdmin && (
          <button
            onClick={onGoToAdmin}
            className="w-full group flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm font-montserrat">{t.dashboard.admin}</p>
                <p className="text-xs text-gray-500 font-montserrat">{language === 'fr' ? 'Gérer l\'application' : 'Manage application'}</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

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
                {t.dashboard.recentOperations}
              </h3>
            </div>
            
            {/* Switch Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('operations')}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[40px] ${
                    activeTab === 'operations'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  {language === 'fr' ? 'Opérations' : 'Operations'}
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[40px] ${
                    activeTab === 'transactions'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  {language === 'fr' ? 'Transactions' : 'Transactions'}
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
                <p className="mt-3 text-gray-600">{t.common.loading}</p>
              </div>
            ) : operations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.dashboard.noOperations}</h4>
                <p className="text-gray-500 text-sm">{t.dashboard.noOperationsDesc}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {operations.map((operation, index) => (
                <div
                  key={operation.id}
                  onClick={() => onViewOperation?.(operation.id)}
                  className={`relative rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 group cursor-pointer hover:scale-[1.02] ${
                    index === 0 ? 'ring-2 ring-blue-100 bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
                        {operation.service ? operation.service.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {operation.service}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          operation.status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
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
                            {operation.price && !isNaN(Number(operation.price)) ? Number(operation.price).toLocaleString() + ' FCFA' : '—'}
                          </p>
                        </div>
                      </div>
                      {operation.status.toLowerCase() === 'success' && operation.sms && (
                        <div className="bg-green-100 rounded-lg p-3 mt-3 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <p className="text-xs font-medium text-green-800">SMS reçu</p>
                            </div>
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
                <h4 className="font-semibold text-gray-900 mb-1">{language === 'fr' ? 'Aucune transaction' : 'No transactions'}</h4>
                <p className="text-gray-500 text-sm">{language === 'fr' ? 'Vos transactions apparaîtront ici' : 'Your transactions will appear here'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-gray-100">
                        {getTransactionTypeIcon(transaction.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {getTransactionTypeText(transaction.type)}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTransactionStatusColor(transaction.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {transaction.status === 'success'
                              ? (language === 'fr' ? 'Réussi' : 'Done')
                              : transaction.status === 'failed'
                              ? (language === 'fr' ? 'Échoué' : 'Failed')
                              : (language === 'fr' ? 'En cours' : 'Pending')}
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
                         transaction.type === 'refund' ? '+' : '-'}{Number(transaction.amount || 0).toLocaleString()} FCFA
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

      </div>
    </Layout>
  );
}