import { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { adminService } from '../../services/admin';
import type { AdminTransaction } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatSignedCurrency } from '../../utils/currency';
import {
  Button,
  Card,
  EmptyState,
  FeedbackBanner,
  PageHeader,
  Pagination,
  TableHead,
  fieldBaseClass,
  fieldClass,
  tdClass,
  thClass,
} from '../../components/admin/ui';
import { errorMessage, useFeedback } from '../../components/admin/useFeedback';
import { SearchIcon } from '../../components/icons';
import { TransactionStatusBadge, TransactionTypeBadge } from './labels';

type TransactionType = 'deposit' | 'withdraw' | 'refund';
type TransactionStatus = 'pending' | 'success' | 'failed';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const { feedback, showError, clear } = useFeedback();

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getTransactions({
        page,
        limit: 20,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        search: submittedSearch || undefined,
      });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      showError(errorMessage(error, 'Impossible de charger les transactions.'));
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, submittedSearch, showError]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSubmittedSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={`${total.toLocaleString('fr-FR')} transactions au total`}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clear} />

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="tx-search" className="sr-only">
              Rechercher une transaction
            </label>
            <input
              id="tx-search"
              type="search"
              placeholder="Référence, utilisateur…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={fieldClass}
            />
          </div>
          <label htmlFor="tx-type" className="sr-only">
            Type
          </label>
          <select
            id="tx-type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TransactionType | '');
              setPage(1);
            }}
            className={fieldBaseClass}
          >
            <option value="">Tous les types</option>
            <option value="deposit">Dépôts</option>
            <option value="refund">Remboursements</option>
            <option value="withdraw">Retraits</option>
          </select>
          <label htmlFor="tx-status" className="sr-only">
            Statut
          </label>
          <select
            id="tx-status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as TransactionStatus | '');
              setPage(1);
            }}
            className={fieldBaseClass}
          >
            <option value="">Tous les statuts</option>
            <option value="success">Réussis</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoués</option>
          </select>
          <Button type="submit" variant="primary" icon={<SearchIcon />}>
            Rechercher
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHead>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Référence</th>
                  <th className={thClass}>Utilisateur</th>
                  <th className={thClass}>Type</th>
                  <th className={`${thClass} text-right`}>Montant</th>
                  <th className={`${thClass} text-center`}>Statut</th>
                  <th className={thClass}>Détails</th>
                </TableHead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                      <td className={`${tdClass} whitespace-nowrap text-gray-500`}>
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className={`${tdClass} font-mono text-xs text-gray-500`}>
                        {tx.reference.slice(0, 12)}…
                      </td>
                      <td className={tdClass}>
                        <p className="font-medium text-gray-900">{tx.user?.username || '—'}</p>
                        <p className="text-xs text-gray-500">{tx.user?.email || ''}</p>
                      </td>
                      <td className={tdClass}>
                        <TransactionTypeBadge type={tx.type} />
                      </td>
                      <td
                        className={`${tdClass} whitespace-nowrap text-right font-medium tabular-nums ${
                          tx.type === 'refund' || tx.type === 'withdraw'
                            ? 'text-rose-700'
                            : 'text-gray-900'
                        }`}
                      >
                        {formatSignedCurrency(
                          tx.amount,
                          tx.type === 'refund' || tx.type === 'withdraw'
                        )}
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <TransactionStatusBadge status={tx.status} />
                      </td>
                      <td className={`${tdClass} text-xs text-gray-500`}>
                        {tx.network && <span className="block">Réseau : {tx.network}</span>}
                        {tx.phoneNumber && <span className="block">Tél : {tx.phoneNumber}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactions.length === 0 && <EmptyState>Aucune transaction trouvée</EmptyState>}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
