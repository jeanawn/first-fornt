import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { adminService } from '../../services/admin';
import type { AdminStats, AdminTransaction } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CURRENCY_LABEL, formatAmount, formatCurrency, formatSignedCurrency } from '../../utils/currency';
import { Button, Card, EmptyState, TableHead, tdClass, thClass } from '../../components/admin/ui';
import { errorMessage } from '../../components/admin/useFeedback';
import { ClockIcon, DocumentIcon, RefreshIcon, RefundIcon, UserIcon } from '../../components/icons';
import { TransactionStatusBadge, TransactionTypeBadge } from './labels';

type StatCard = {
  label: string;
  value: number | string;
  suffix?: string;
  subLabel: string;
  icon: ReactNode;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [globalStats, transactionsData] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getTransactions({ limit: 10 }),
      ]);
      setStats(globalStats);
      setRecentTransactions(transactionsData.transactions);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setLoadError(errorMessage(error, 'Impossible de charger le tableau de bord.'));
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
      <Card className="p-12 text-center">
        <p className="text-sm text-gray-700">
          {loadError || 'Impossible de charger les statistiques.'}
        </p>
        <div className="mt-4 flex justify-center">
          <Button onClick={loadData} icon={<RefreshIcon />}>
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  const statCards: StatCard[] = [
    {
      label: 'Utilisateurs',
      value: stats.totalUsers.toLocaleString('fr-FR'),
      subLabel: `${stats.activeUsers} actifs`,
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      label: 'Opérations',
      value: stats.totalOperations.toLocaleString('fr-FR'),
      subLabel: `${stats.successfulOperations} réussies`,
      icon: <DocumentIcon className="w-5 h-5" />,
    },
    {
      label: 'En attente',
      value: stats.pendingOperations.toLocaleString('fr-FR'),
      subLabel: `${stats.failedOperations} échecs`,
      icon: <ClockIcon className="w-5 h-5" />,
    },
    {
      label: 'Revenus',
      value: formatAmount(stats.totalRevenue),
      suffix: CURRENCY_LABEL,
      subLabel: `${formatCurrency(stats.totalRefunds)} remboursés`,
      icon: <RefundIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                {card.icon}
              </span>
              <span className="text-sm font-medium">{card.label}</span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
              {card.value}
              {card.suffix && (
                <span className="ml-1 text-sm font-medium text-gray-400">{card.suffix}</span>
              )}
            </p>
            <p className="mt-1 text-sm text-gray-500">{card.subLabel}</p>
          </Card>
        ))}
      </div>

      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {loadError}
        </div>
      )}

      <Card>
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">Transactions récentes</h3>
          <p className="mt-0.5 text-sm text-gray-500">Les 10 derniers mouvements de solde</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead>
              <th className={thClass}>Date</th>
              <th className={thClass}>Utilisateur</th>
              <th className={thClass}>Type</th>
              <th className={`${thClass} text-right`}>Montant</th>
              <th className={`${thClass} text-center`}>Statut</th>
            </TableHead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                  <td className={`${tdClass} whitespace-nowrap text-gray-500`}>
                    {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className={`${tdClass} font-medium text-gray-900`}>
                    {tx.user?.username || '—'}
                  </td>
                  <td className={tdClass}>
                    <TransactionTypeBadge type={tx.type} />
                  </td>
                  <td
                    className={`${tdClass} whitespace-nowrap text-right font-medium tabular-nums ${
                      tx.type === 'refund' ? 'text-rose-700' : 'text-gray-900'
                    }`}
                  >
                    {formatSignedCurrency(tx.amount, tx.type === 'refund')}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <TransactionStatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentTransactions.length === 0 && <EmptyState>Aucune transaction récente</EmptyState>}
        </div>
      </Card>
    </div>
  );
}
