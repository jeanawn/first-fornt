import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminOperation } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminOperations() {
  const [operations, setOperations] = useState<AdminOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    loadOperations();
  }, [page, statusFilter]);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOperations({
        page,
        limit: 20,
        status: statusFilter || undefined,
      });
      setOperations(response.operations);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erreur chargement opérations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (operationId: string) => {
    const reason = prompt('Raison du remboursement (optionnel):');
    if (reason === null) return; // Cancelled

    try {
      setRefundingId(operationId);
      await adminService.refundOperation(operationId, reason || undefined);
      loadOperations();
      alert('Remboursement effectué avec succès');
    } catch (error) {
      console.error('Erreur remboursement:', error);
      alert('Erreur lors du remboursement');
    } finally {
      setRefundingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
    };
    const labels: Record<string, string> = {
      SUCCESS: '✅ Succès',
      FAILED: '❌ Échec',
      PENDING: '⏳ En attente',
      PROCESSING: '🔄 Traitement',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Opérations</h2>
          <p className="text-gray-600">Historique des achats de numéros</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="SUCCESS">Succès</option>
              <option value="FAILED">Échec</option>
              <option value="PENDING">En attente</option>
              <option value="PROCESSING">Traitement</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadOperations}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Operations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {operations.map((op) => (
                    <tr key={op.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(op.createdDate).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-gray-900">{op.user?.username || 'N/A'}</span>
                          <p className="text-xs text-gray-500">{op.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">{op.servicePricing?.serviceCode || 'N/A'}</span>
                          <p className="text-xs text-gray-500">{op.servicePricing?.countryCode}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {op.number ? (
                          <div>
                            <span className="font-mono text-sm">{op.number}</span>
                            {op.sms && (
                              <p className="text-xs text-green-600 font-medium">SMS: {op.sms}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(op.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold">
                          {op.servicePricing?.price || 0}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">cr</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {op.status !== 'FAILED' && (
                          <button
                            onClick={() => handleRefund(op.id)}
                            disabled={refundingId === op.id}
                            className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 disabled:opacity-50"
                          >
                            {refundingId === op.id ? '...' : '💸 Rembourser'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {operations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune opération trouvée
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} sur {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
