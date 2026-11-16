import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import type { AdminOperation } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatAmount } from '../../utils/currency';
import {
  Button,
  Card,
  EmptyState,
  Label,
  PageHeader,
  Pagination,
  TableHead,
  fieldClass,
  tdClass,
  thClass,
} from '../../components/admin/ui';
import { RefreshIcon, RefundIcon } from '../../components/icons';
import { OperationStatusBadge } from './labels';

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

  return (
    <div className="space-y-6">
      <PageHeader title="Opérations" description="Historique des achats de numéros" />

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-56">
            <Label htmlFor="op-status">Statut</Label>
            <select
              id="op-status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={fieldClass}
            >
              <option value="">Tous les statuts</option>
              <option value="SUCCESS">Succès</option>
              <option value="FAILED">Échec</option>
              <option value="PENDING">En attente</option>
              <option value="PROCESSING">Traitement</option>
            </select>
          </div>
          <Button onClick={loadOperations} icon={<RefreshIcon />}>
            Actualiser
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHead>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Utilisateur</th>
                  <th className={thClass}>Service</th>
                  <th className={thClass}>Numéro</th>
                  <th className={`${thClass} text-center`}>Statut</th>
                  <th className={`${thClass} text-right`}>Prix</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </TableHead>
                <tbody className="divide-y divide-gray-100">
                  {operations.map((op) => (
                    <tr key={op.id} className="transition-colors hover:bg-gray-50">
                      <td className={`${tdClass} whitespace-nowrap text-gray-500`}>
                        {new Date(op.createdDate).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className={tdClass}>
                        <span className="font-medium text-gray-900">{op.user?.username || '—'}</span>
                        <p className="text-xs text-gray-500">{op.user?.email}</p>
                      </td>
                      <td className={tdClass}>
                        <span className="font-medium text-gray-900">
                          {op.servicePricing?.serviceCode || '—'}
                        </span>
                        <p className="text-xs text-gray-500">{op.servicePricing?.countryCode}</p>
                      </td>
                      <td className={tdClass}>
                        {op.number ? (
                          <>
                            <span className="font-mono text-sm text-gray-900">{op.number}</span>
                            {op.sms && (
                              <p className="text-xs font-medium text-emerald-700">SMS: {op.sms}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <OperationStatusBadge status={op.status} />
                      </td>
                      <td className={`${tdClass} whitespace-nowrap text-right font-medium tabular-nums text-gray-900`}>
                        {formatAmount(op.servicePricing?.price)}
                        <span className="ml-1 text-xs font-normal text-gray-400">FCFA</span>
                      </td>
                      <td className={`${tdClass} text-right`}>
                        {op.status !== 'FAILED' && (
                          <Button
                            variant="danger"
                            onClick={() => handleRefund(op.id)}
                            disabled={refundingId === op.id}
                            icon={<RefundIcon />}
                            className="px-2.5 py-1.5 text-xs"
                          >
                            {refundingId === op.id ? 'En cours…' : 'Rembourser'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {operations.length === 0 && <EmptyState>Aucune opération trouvée</EmptyState>}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
