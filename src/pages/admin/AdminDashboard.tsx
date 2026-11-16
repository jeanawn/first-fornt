import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { adminService } from '../../services/admin';
import type { AdminStats, AdminTransaction } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CURRENCY_LABEL, formatAmount, formatCurrency, formatSignedCurrency } from '../../utils/currency';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [globalStats, transactionsData] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getTransactions({ limit: 10 }),
      ]);
      setStats(globalStats);
      setRecentTransactions(transactionsData.transactions);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur de chargement des statistiques</p>
      </div>
    );
  }

  type StatCard = {
    label: string;
    value: number | string;
    suffix?: string;
    color: string;
    subLabel: string;
    icon: ReactNode;
  };

  const statCards: StatCard[] = [
    {
      label: 'Utilisateurs', value: stats.totalUsers, color: 'bg-blue-500', subLabel: `${stats.activeUsers} actifs`,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    },
    {
      label: 'Opérations', value: stats.totalOperations, color: 'bg-green-500', subLabel: `${stats.successfulOperations} réussies`,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    },
    {
      label: 'En attente', value: stats.pendingOperations, color: 'bg-yellow-500', subLabel: `${stats.failedOperations} échecs`,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: 'Revenus', value: formatAmount(stats.totalRevenue), suffix: CURRENCY_LABEL, color: 'bg-purple-500', subLabel: `${formatCurrency(stats.totalRefunds)} remboursés`,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {card.value}
                {card.suffix && <span className="text-base font-medium text-gray-400 ml-1">{card.suffix}</span>}
              </span>
            </div>
            <p className="text-gray-600 font-medium">{card.label}</p>
            <p className="text-sm text-gray-400">{card.subLabel}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Transactions récentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Utilisateur</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Type</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">Montant</th>
                <th className="text-center py-3 px-2 font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-medium text-gray-900">{tx.user?.username || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'deposit' ? 'bg-green-100 text-green-700' :
                      tx.type === 'refund' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.type === 'deposit' ? 'Dépôt' : tx.type === 'refund' ? 'Remboursement' : 'Retrait'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    <span className={tx.type === 'refund' ? 'text-red-600' : 'text-green-600'}>
                      {formatSignedCurrency(tx.amount, tx.type === 'refund')}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'success' ? 'bg-green-100 text-green-700' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status === 'success' ? 'Réussi' : tx.status === 'pending' ? 'En attente' : 'Échoué'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Aucune transaction récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
