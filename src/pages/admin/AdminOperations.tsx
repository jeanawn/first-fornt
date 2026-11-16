import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin';
import type { AdminOperation } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatAmount, formatCurrency } from '../../utils/currency';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  FeedbackBanner,
  Label,
  PageHeader,
  Pagination,
  TableHead,
  fieldClass,
  tdClass,
  thClass,
} from '../../components/admin/ui';
import { errorMessage, useFeedback } from '../../components/admin/useFeedback';
import { RefreshIcon, RefundIcon } from '../../components/icons';
import { OperationStatusBadge } from './labels';

export default function AdminOperations() {
  const [operations, setOperations] = useState<AdminOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [refundTarget, setRefundTarget] = useState<AdminOperation | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundPending, setRefundPending] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);
  const { feedback, showSuccess, showError, clear } = useFeedback();

  const loadOperations = useCallback(async () => {
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
      showError(errorMessage(error, 'Impossible de charger les opérations.'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, showError]);

  useEffect(() => {
    loadOperations();
  }, [loadOperations]);

  const openRefund = (operation: AdminOperation) => {
    setRefundTarget(operation);
    setRefundReason('');
    setRefundError(null);
  };

  const closeRefund = () => {
    setRefundTarget(null);
    setRefundReason('');
    setRefundError(null);
  };

  const handleRefund = async () => {
    if (!refundTarget) return;

    try {
      setRefundPending(true);
      setRefundError(null);
      await adminService.refundOperation(refundTarget.id, refundReason || undefined);
      const username = refundTarget.user?.username || "l'utilisateur";
      closeRefund();
      showSuccess(`Opération remboursée à ${username}.`);
      loadOperations();
    } catch (error) {
      console.error('Erreur remboursement:', error);
      setRefundError(errorMessage(error, 'Le remboursement a échoué. Réessayez.'));
    } finally {
      setRefundPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Opérations" description="Historique des achats de numéros" />

      <FeedbackBanner feedback={feedback} onDismiss={clear} />

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
                            onClick={() => openRefund(op)}
                            icon={<RefundIcon />}
                            className="px-2.5 py-1.5 text-xs"
                          >
                            Rembourser
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

      {refundTarget && (
        <ConfirmDialog
          title="Rembourser cette opération"
          summary={[
            { label: 'Utilisateur', value: refundTarget.user?.username || '—' },
            {
              label: 'Service',
              value: `${refundTarget.servicePricing?.serviceCode || '—'} · ${
                refundTarget.servicePricing?.countryCode || '—'
              }`,
            },
            { label: 'Numéro', value: refundTarget.number || '—' },
            { label: 'Montant', value: formatCurrency(refundTarget.servicePricing?.price) },
          ]}
          question="Le montant sera recrédité sur le solde de cet utilisateur. Cette action est définitive."
          confirmLabel="Rembourser"
          pending={refundPending}
          error={refundError}
          onConfirm={handleRefund}
          onCancel={closeRefund}
        >
          <Label htmlFor="refund-reason">Raison (optionnel)</Label>
          <input
            id="refund-reason"
            type="text"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className={fieldClass}
            placeholder="Numéro non reçu, SMS non délivré…"
          />
        </ConfirmDialog>
      )}
    </div>
  );
}
