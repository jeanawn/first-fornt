import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminStats, DailyStats, FinanceOverview, AdminTransaction } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [finance, setFinance] = useState<FinanceOverview | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [globalStats, daily, financeData, transactionsData] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getDailyStats(7),
        adminService.getFinanceOverview(),
        adminService.getTransactions({ limit: 10 }),
      ]);
      setStats(globalStats);
      setDailyStats(daily);
      setFinance(financeData);
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

  const statCards = [
    { label: 'Utilisateurs', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500', subLabel: `${stats.activeUsers} actifs` },
    { label: 'Opérations', value: stats.totalOperations, icon: '📱', color: 'bg-green-500', subLabel: `${stats.successfulOperations} réussies` },
    { label: 'En attente', value: stats.pendingOperations, icon: '⏳', color: 'bg-yellow-500', subLabel: `${stats.failedOperations} échecs` },
    { label: 'Revenus', value: `${stats.totalRevenue.toFixed(0)}`, icon: '💰', color: 'bg-purple-500', subLabel: `${stats.totalRefunds.toFixed(0)} remboursés` },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl text-white`}>
                {card.icon}
              </div>
              <span className="text-3xl font-bold text-gray-900">{card.value}</span>
            </div>
            <p className="text-gray-600 font-medium">{card.label}</p>
            <p className="text-sm text-gray-400">{card.subLabel}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operations Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Opérations (7 derniers jours)</h3>
          <div className="space-y-3">
            {dailyStats.slice(-7).map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 w-20">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${Math.min((day.successfulOperations / Math.max(day.operations, 1)) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-16 text-right">
                  {day.successfulOperations}/{day.operations}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenus (7 derniers jours)</h3>
          <div className="space-y-3">
            {dailyStats.slice(-7).map((day, index) => {
              const maxRevenue = Math.max(...dailyStats.map(d => d.revenue), 1);
              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 w-20">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-20 text-right">
                    {day.revenue.toFixed(0)} cr
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {stats.totalOperations > 0 ? ((stats.successfulOperations / stats.totalOperations) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-green-700">Taux de succès</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {stats.totalOperations > 0 ? ((stats.failedOperations / stats.totalOperations) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-red-700">Taux d'échec</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalUsers > 0 ? (stats.totalOperations / stats.totalUsers).toFixed(1) : 0}
            </p>
            <p className="text-sm text-blue-700">Op/Utilisateur</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {stats.successfulOperations > 0 ? (stats.totalRevenue / stats.successfulOperations).toFixed(0) : 0}
            </p>
            <p className="text-sm text-purple-700">Revenu moyen/Op</p>
          </div>
        </div>
      </div>

      {/* Finance Overview */}
      {finance && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Chiffre d'Affaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CA Brut */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80">Dépôts réussis</p>
              <p className="text-3xl font-bold mt-2">${Number(finance.chiffreAffaires.deposits.total).toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">{finance.chiffreAffaires.deposits.count} transactions</p>
            </div>
            {/* Remboursements */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80">Remboursements</p>
              <p className="text-3xl font-bold mt-2">${Number(finance.chiffreAffaires.refunds.total).toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">{finance.chiffreAffaires.refunds.count} remboursements</p>
            </div>
            {/* CA Net */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80">Revenu Net</p>
              <p className="text-3xl font-bold mt-2">${Number(finance.chiffreAffaires.netRevenue).toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">Taux succès: {finance.operations.successRate}%</p>
            </div>
          </div>

          {/* Détails supplémentaires */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">En attente</p>
              <p className="text-xl font-bold text-yellow-800">${Number(finance.transactions.pending.total).toFixed(2)}</p>
              <p className="text-xs text-yellow-600">{finance.transactions.pending.count} transactions</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Échouées</p>
              <p className="text-xl font-bold text-red-800">${Number(finance.transactions.failed.total).toFixed(2)}</p>
              <p className="text-xs text-red-600">{finance.transactions.failed.count} transactions</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Revenus SMS</p>
              <p className="text-xl font-bold text-green-800">${Number(finance.operations.successful.revenue).toFixed(2)}</p>
              <p className="text-xs text-green-600">{finance.operations.successful.count} opérations</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">Soldes utilisateurs</p>
              <p className="text-xl font-bold text-purple-800">${Number(finance.userBalances.total).toFixed(2)}</p>
              <p className="text-xs text-purple-600">Total en compte</p>
            </div>
          </div>
        </div>
      )}

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
                      {tx.type === 'refund' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
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
