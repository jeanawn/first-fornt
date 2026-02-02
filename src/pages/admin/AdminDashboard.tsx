import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminStats, DailyStats } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [globalStats, daily] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getDailyStats(7),
      ]);
      setStats(globalStats);
      setDailyStats(daily);
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
    </div>
  );
}
