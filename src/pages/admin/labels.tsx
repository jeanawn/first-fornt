import type { ReactNode } from 'react';
import { Badge } from '../../components/admin/ui';
import type { Tone } from '../../components/admin/ui';
import { BanIcon, CheckIcon, ClockIcon, RefreshIcon } from '../../components/icons';

/** Shared wording and tones, so a status reads the same on every admin screen. */

const TRANSACTION_TYPES: Record<string, string> = {
  deposit: 'Dépôt',
  refund: 'Remboursement',
  withdraw: 'Retrait',
  purchase: 'Achat',
};

export function TransactionTypeBadge({ type }: { type: string }) {
  const tone: Tone = type === 'deposit' ? 'success' : type === 'refund' ? 'warning' : 'neutral';
  return <Badge tone={tone}>{TRANSACTION_TYPES[type] || type}</Badge>;
}

const TRANSACTION_STATUS: Record<string, { label: string; tone: Tone; icon: ReactNode }> = {
  success: { label: 'Réussi', tone: 'success', icon: <CheckIcon className="w-3.5 h-3.5" /> },
  pending: { label: 'En attente', tone: 'warning', icon: <ClockIcon className="w-3.5 h-3.5" /> },
  failed: { label: 'Échoué', tone: 'danger', icon: <BanIcon className="w-3.5 h-3.5" /> },
};

export function TransactionStatusBadge({ status }: { status: string }) {
  const config = TRANSACTION_STATUS[status] || {
    label: status,
    tone: 'neutral' as Tone,
    icon: null,
  };
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {config.label}
    </Badge>
  );
}

const OPERATION_STATUS: Record<string, { label: string; tone: Tone; icon: ReactNode }> = {
  SUCCESS: { label: 'Succès', tone: 'success', icon: <CheckIcon className="w-3.5 h-3.5" /> },
  FAILED: { label: 'Échec', tone: 'danger', icon: <BanIcon className="w-3.5 h-3.5" /> },
  PENDING: { label: 'En attente', tone: 'warning', icon: <ClockIcon className="w-3.5 h-3.5" /> },
  PROCESSING: { label: 'Traitement', tone: 'info', icon: <RefreshIcon className="w-3.5 h-3.5" /> },
};

export function OperationStatusBadge({ status }: { status: string }) {
  const config = OPERATION_STATUS[status] || {
    label: status,
    tone: 'neutral' as Tone,
    icon: null,
  };
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
