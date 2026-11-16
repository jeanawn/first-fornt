/**
 * Single source of truth for money display across the app.
 * All amounts stored by the API are in FCFA, which has no minor unit,
 * so values are always rendered as whole numbers.
 */

export const CURRENCY_LABEL = 'FCFA';

/** Rounds to a whole FCFA amount with thousand separators, e.g. "12 500". */
export function formatAmount(value: number | string | null | undefined): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '0';
  return Math.round(amount).toLocaleString('fr-FR');
}

/** Same as formatAmount, suffixed with the currency label, e.g. "12 500 FCFA". */
export function formatCurrency(value: number | string | null | undefined): string {
  return `${formatAmount(value)} ${CURRENCY_LABEL}`;
}

/** Signed amount with the currency label, e.g. "-12 500 FCFA". */
export function formatSignedCurrency(
  value: number | string | null | undefined,
  negative: boolean
): string {
  return `${negative ? '-' : '+'}${formatCurrency(value)}`;
}
