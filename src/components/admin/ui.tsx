import { useEffect } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../icons';
import type { Feedback } from './useFeedback';

/**
 * Shared admin primitives. The admin area is a dense working tool, so the
 * palette stays neutral: greys carry the layout, and colour is spent only on
 * status, in muted tints rather than saturated fills.
 */

/* ── Surfaces ── */

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── Badge ── */

export type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

const TONES: Record<Tone, string> = {
  neutral: 'bg-gray-50 text-gray-600 border-gray-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function Badge({
  tone = 'neutral',
  icon,
  children,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

/* ── Button ── */

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-900',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  danger: 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50',
  ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({
  variant = 'secondary',
  icon,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

/** Square icon-only button. `label` is required: it becomes the accessible name. */
export function IconButton({
  label,
  variant = 'ghost',
  icon,
  className = '',
  ...props
}: Omit<ButtonProps, 'children'> & { label: string }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}

/* ── Form controls ── */

/** Field styling without a width, so callers choose w-full or an intrinsic width. */
export const fieldBaseClass =
  'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500';

/** The common case: a field that fills its container. */
export const fieldClass = `w-full ${fieldBaseClass}`;

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

/* ── Table ── */

export const thClass =
  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500';
export const tdClass = 'px-4 py-3 text-sm text-gray-700 align-middle';

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-gray-200 bg-gray-50/70">
      <tr>{children}</tr>
    </thead>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="px-4 py-12 text-center text-sm text-gray-500">{children}</div>;
}

/* ── Pagination ── */

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
      <Button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        icon={<ChevronLeftIcon />}
      >
        Précédent
      </Button>
      <span className="text-sm text-gray-500">
        Page {page} sur {totalPages}
      </span>
      <Button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex-row-reverse"
        icon={<ChevronRightIcon />}
      >
        Suivant
      </Button>
    </div>
  );
}

/* ── Modal ── */

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ── Feedback banner ── */

export function FeedbackBanner({
  feedback,
  onDismiss,
}: {
  feedback: Feedback;
  onDismiss: () => void;
}) {
  if (!feedback) return null;
  const isError = feedback.kind === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 ${
        isError ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'
      }`}
    >
      <p className={`text-sm ${isError ? 'text-rose-700' : 'text-emerald-700'}`}>
        {feedback.message}
      </p>
      <IconButton
        label="Fermer"
        onClick={onDismiss}
        icon={<CloseIcon />}
        className={`h-6 w-6 flex-shrink-0 ${
          isError
            ? 'text-rose-600 hover:bg-rose-100 hover:text-rose-800'
            : 'text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800'
        }`}
      />
    </div>
  );
}

/* ── Confirm dialog ── */

/**
 * Stands in front of anything irreversible. `summary` restates what is about
 * to happen with real values, so the decision is made on the facts and not on
 * the memory of which row was clicked.
 */
export function ConfirmDialog({
  title,
  summary,
  question,
  confirmLabel,
  variant = 'danger',
  pending = false,
  error,
  children,
  onConfirm,
  onCancel,
}: {
  title: string;
  summary?: { label: string; value: ReactNode }[];
  question: ReactNode;
  confirmLabel: string;
  variant?: Variant;
  pending?: boolean;
  error?: string | null;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={pending ? () => {} : onCancel}>
      {summary && summary.length > 0 && (
        <dl className="mb-4 divide-y divide-gray-100 rounded-lg border border-gray-200">
          {summary.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 px-3 py-2">
              <dt className="text-sm text-gray-500">{row.label}</dt>
              <dd className="text-right text-sm font-medium text-gray-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="text-sm text-gray-700">{question}</p>

      {children && <div className="mt-4">{children}</div>}

      {error && (
        <p role="alert" className="mt-4 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <Button onClick={onCancel} disabled={pending} className="flex-1">
          Annuler
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={pending} className="flex-1">
          {pending ? 'En cours…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
