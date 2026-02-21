import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminTransaction } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [page, typeFilter, statusFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await adminService.getTransactions(params);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTransactions();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Dépôt';
      case 'refund': return 'Remboursement';
      case 'withdraw': return 'Retrait';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Réussi';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <span className="text-sm text-gray-500">{total} transactions au total</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Rechercher (référence, utilisateur...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            <option value="deposit">Dépôts</option>
            <option value="refund">Remboursements</option>
            <option value="withdraw">Retraits</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="success">Réussis</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoués</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">Référence</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">Utilisateur</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-right py-4 px-4 font-medium text-gray-600">Montant</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-600">{tx.reference.slice(0, 12)}...</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{tx.user?.username || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{tx.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'deposit' ? 'bg-green-100 text-green-700' :
                          tx.type === 'refund' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {getTypeLabel(tx.type)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-bold ${
                          tx.type === 'refund' || tx.type === 'withdraw' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {tx.type === 'refund' || tx.type === 'withdraw' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'success' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getStatusLabel(tx.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {tx.network && <span className="block">Réseau: {tx.network}</span>}
                        {tx.phoneNumber && <span className="block">Tél: {tx.phoneNumber}</span>}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        Aucune transaction trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
