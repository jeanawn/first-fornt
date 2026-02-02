import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

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

const ACTION_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  REFUND: { label: 'Remboursement', color: 'bg-orange-100 text-orange-800', icon: '💸' },
  CREDIT: { label: 'Crédit', color: 'bg-green-100 text-green-800', icon: '➕' },
  DEBIT: { label: 'Débit', color: 'bg-red-100 text-red-800', icon: '➖' },
  USER_ACTIVATE: { label: 'Activation utilisateur', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  USER_DEACTIVATE: { label: 'Désactivation utilisateur', color: 'bg-gray-100 text-gray-800', icon: '🚫' },
  PROVIDER_CREATE: { label: 'Création', color: 'bg-purple-100 text-purple-800', icon: '🆕' },
  PROVIDER_UPDATE: { label: 'Modification', color: 'bg-indigo-100 text-indigo-800', icon: '✏️' },
  PROVIDER_DELETE: { label: 'Suppression', color: 'bg-red-100 text-red-800', icon: '🗑️' },
  OPERATION_CANCEL: { label: 'Annulation opération', color: 'bg-yellow-100 text-yellow-800', icon: '❌' },
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAuditLogs({ page, limit: 30 });
      setLogs(response.logs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erreur chargement logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const config = ACTION_LABELS[action] || { label: action, color: 'bg-gray-100 text-gray-800', icon: '📋' };
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Logs d'audit</h2>
          <p className="text-gray-600">Historique des actions administratives</p>
        </div>
        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getActionBadge(log.action)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{log.admin?.username || 'Système'}</span>
                          {' '}a effectué une action
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.createdAt).toLocaleString('fr-FR')}
                          {log.ipAddress && ` • IP: ${log.ipAddress}`}
                        </p>
                        {(log.targetUserId || log.targetOperationId) && (
                          <p className="text-xs text-gray-400 mt-1">
                            {log.targetUserId && `User: ${log.targetUserId.slice(0, 8)}...`}
                            {log.targetOperationId && ` Op: ${log.targetOperationId.slice(0, 8)}...`}
                          </p>
                        )}
                      </div>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <button
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {expandedLog === log.id ? '▲ Masquer' : '▼ Détails'}
                      </button>
                    )}
                  </div>
                  {expandedLog === log.id && log.details && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {logs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun log d'audit trouvé
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
