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
  IconButton,
  Label,
  Modal,
  PageHeader,
  Pagination,
  TableHead,
  fieldClass,
  tdClass,
  thClass,
} from '../../components/admin/ui';
import { CopyableCode } from '../../components/admin/CopyableCode';
import { errorMessage, useFeedback } from '../../components/admin/useFeedback';
import { EyeIcon, RefreshIcon, RefundIcon } from '../../components/icons';
import { OperationStatusBadge } from './labels';

export default function AdminOperations() {
  const [operations, setOperations] = useState<AdminOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [detailTarget, setDetailTarget] = useState<AdminOperation | null>(null);
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
                          <button
                            type="button"
                            onClick={() => setDetailTarget(op)}
                            title="Agrandir pour lire le code"
                            className="block rounded-md text-left transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                          >
                            <span className="font-mono text-sm text-gray-900">{op.number}</span>
                            {op.sms && (
                              <span className="block font-mono text-base font-semibold tracking-wide text-emerald-700">
                                {op.sms}
                              </span>
                            )}
                          </button>
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
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            label={`Agrandir l'opération de ${op.user?.username || 'cet utilisateur'}`}
                            onClick={() => setDetailTarget(op)}
                            icon={<EyeIcon />}
                          />
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
                        </div>
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

      {detailTarget && (
        <Modal title="Détail de l'opération" onClose={() => setDetailTarget(null)}>
          <div className="space-y-4">
            {detailTarget.sms ? (
              <CopyableCode label="Code reçu" value={detailTarget.sms} />
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">
                  {detailTarget.status === 'FAILED'
                    ? "Aucun code : l'opération a échoué."
                    : 'Aucun code reçu pour le moment.'}
                </p>
              </div>
            )}

            {detailTarget.number && (
              <CopyableCode label="Numéro" value={detailTarget.number} size="md" />
            )}

            <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200">
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-sm text-gray-500">Statut</dt>
                <dd>
                  <OperationStatusBadge status={detailTarget.status} />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-sm text-gray-500">Utilisateur</dt>
                <dd className="text-right text-sm font-medium text-gray-900">
                  {detailTarget.user?.username || '—'}
                  <span className="block text-xs font-normal text-gray-500">
                    {detailTarget.user?.email}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-sm text-gray-500">Service</dt>
                <dd className="text-right text-sm font-medium text-gray-900">
                  {detailTarget.servicePricing?.serviceCode || '—'}
                  <span className="block text-xs font-normal text-gray-500">
                    {detailTarget.servicePricing?.countryCode}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-sm text-gray-500">Prix</dt>
                <dd className="text-sm font-medium tabular-nums text-gray-900">
                  {formatCurrency(detailTarget.servicePricing?.price)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-sm text-gray-500">Date</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(detailTarget.createdDate).toLocaleString('fr-FR')}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-sm text-gray-500">Référence</dt>
                <dd className="break-all text-right font-mono text-xs text-gray-500">
                  {detailTarget.reference}
                </dd>
              </div>
            </dl>

            <div className="flex gap-3 pt-1">
              <Button onClick={() => setDetailTarget(null)} className="flex-1">
                Fermer
              </Button>
              {detailTarget.status !== 'FAILED' && (
                <Button
                  variant="danger"
                  onClick={() => {
                    const target = detailTarget;
                    setDetailTarget(null);
                    openRefund(target);
                  }}
                  icon={<RefundIcon />}
                  className="flex-1"
                >
                  Rembourser
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

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
