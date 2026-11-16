import { useState } from 'react';
import { Button } from './ui';
import { CheckIcon, CopyIcon } from '../icons';

/**
 * A value an admin has to read out loud or paste elsewhere: a verification
 * code, a phone number. Shown large and monospaced so it stays legible at a
 * glance, and selectable in one click for the cases where copy is blocked.
 */
export function CopyableCode({
  value,
  label,
  size = 'lg',
}: {
  value: string;
  label: string;
  size?: 'lg' | 'md';
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable outside a secure context; the value stays
      // selectable, so tell the admin to copy it by hand rather than fail mute.
      setCopyFailed(true);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p
            className={`mt-1.5 select-all break-all font-mono font-semibold tracking-wider text-gray-900 ${
              size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-xl'
            }`}
          >
            {value}
          </p>
        </div>
        <Button
          onClick={copy}
          icon={copied ? <CheckIcon /> : <CopyIcon />}
          className="flex-shrink-0"
        >
          {copied ? 'Copié' : 'Copier'}
        </Button>
      </div>
      {copyFailed && (
        <p role="alert" className="mt-2 text-xs text-rose-700">
          Copie automatique indisponible. Sélectionnez le texte pour le copier.
        </p>
      )}
    </div>
  );
}
