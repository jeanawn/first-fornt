/**
 * A provider bug used to persist the literal string "[object Object]" as a
 * verification code, and those rows are still in the database. Nothing can
 * recover the real code, so the interface must at least not present that
 * string as something to read or copy.
 */

const UNREADABLE = ['[object object]', 'undefined', 'null', 'nan'];

/** The code to display, or null when there is nothing readable to show. */
export function readableSmsCode(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return null;

  const text = value.trim();
  if (!text || UNREADABLE.includes(text.toLowerCase())) return null;
  return text;
}

/** True when a code was stored but is unusable, which is worth telling the admin. */
export function isCorruptedSmsCode(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== '' && readableSmsCode(value) === null;
}
