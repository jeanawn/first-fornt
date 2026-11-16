import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { adminService } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FeedbackBanner,
  PageHeader,
  Pagination,
} from '../../components/admin/ui';
import type { Tone } from '../../components/admin/ui';
import { errorMessage, useFeedback } from '../../components/admin/useFeedback';
import {
  BanIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  DocumentIcon,
  EditIcon,
  MinusIcon,
  PlusIcon,
  RefreshIcon,
  RefundIcon,
  SparkIcon,
  TrashIcon,
} from '../../components/icons';

interface AuditLog {
  id: string;
  action: string;
  admin: { id: string; username: string } | null;
  targetUserId?: string;
  targetOperationId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

const iconClass = 'w-3.5 h-3.5';

const ACTION_LABELS: Record<string, { label: string; tone: Tone; icon: ReactNode }> = {
  REFUND: { label: 'Remboursement', tone: 'warning', icon: <RefundIcon className={iconClass} /> },
  CREDIT: { label: 'Crédit', tone: 'success', icon: <PlusIcon className={iconClass} /> },
  DEBIT: { label: 'Débit', tone: 'danger', icon: <MinusIcon className={iconClass} /> },
  USER_ACTIVATE: { label: 'Activation utilisateur', tone: 'success', icon: <CheckIcon className={iconClass} /> },
  USER_DEACTIVATE: { label: 'Désactivation utilisateur', tone: 'neutral', icon: <BanIcon className={iconClass} /> },
  PROVIDER_CREATE: { label: 'Création', tone: 'info', icon: <SparkIcon className={iconClass} /> },
  PROVIDER_UPDATE: { label: 'Modification', tone: 'info', icon: <EditIcon className={iconClass} /> },
  PROVIDER_DELETE: { label: 'Suppression', tone: 'danger', icon: <TrashIcon className={iconClass} /> },
  OPERATION_CANCEL: { label: 'Annulation opération', tone: 'danger', icon: <CloseIcon className={iconClass} /> },
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const { feedback, showError, clear } = useFeedback();

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAuditLogs({ page, limit: 30 });
      setLogs(response.logs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erreur chargement logs:', error);
      showError(errorMessage(error, "Impossible de charger les logs d'audit."));
    } finally {
      setLoading(false);
    }
  }, [page, showError]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const getActionBadge = (action: string) => {
    const config = ACTION_LABELS[action] || {
      label: action,
      tone: 'neutral' as Tone,
      icon: <DocumentIcon className={iconClass} />,
    };
    return (
      <Badge tone={config.tone} icon={config.icon}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs d'audit"
        description="Historique des actions administratives"
        actions={
          <Button onClick={loadLogs} icon={<RefreshIcon />}>
            Actualiser
          </Button>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={clear} />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {logs.map((log) => {
                const expanded = expandedLog === log.id;
                const hasDetails = log.details && Object.keys(log.details).length > 0;
                return (
                  <div key={log.id} className="px-5 py-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex-shrink-0 pt-0.5">{getActionBadge(log.action)}</div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{log.admin?.username || 'Système'}</span>{' '}
                            a effectué une action
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleString('fr-FR')}
                            {log.ipAddress && ` · IP ${log.ipAddress}`}
                          </p>
                          {(log.targetUserId || log.targetOperationId) && (
                            <p className="mt-1 font-mono text-xs text-gray-400">
                              {log.targetUserId && `User ${log.targetUserId.slice(0, 8)}…`}
                              {log.targetOperationId && ` Op ${log.targetOperationId.slice(0, 8)}…`}
                            </p>
                          )}
                        </div>
                      </div>
                      {hasDetails && (
                        <Button
                          variant="ghost"
                          onClick={() => setExpandedLog(expanded ? null : log.id)}
                          aria-expanded={expanded}
                          className="flex-shrink-0 flex-row-reverse px-2 py-1 text-xs"
                          icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        >
                          {expanded ? 'Masquer' : 'Détails'}
                        </Button>
                      )}
                    </div>
                    {expanded && log.details && (
                      <pre className="mt-3 max-h-40 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>

            {logs.length === 0 && <EmptyState>Aucun log d'audit trouvé</EmptyState>}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
