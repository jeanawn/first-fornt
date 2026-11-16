import { useCallback, useRef, useState } from 'react';

export type Feedback = { kind: 'success' | 'error'; message: string } | null;

/**
 * Replaces alert() for the outcome of an admin action: a success note that
 * clears itself, an error that stays until dismissed or superseded.
 */
export function useFeedback(successTimeout = 4000) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const clear = useCallback(() => {
    clearTimer();
    setFeedback(null);
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      clearTimer();
      setFeedback({ kind: 'success', message });
      timer.current = setTimeout(() => setFeedback(null), successTimeout);
    },
    [successTimeout]
  );

  const showError = useCallback((message: string) => {
    clearTimer();
    setFeedback({ kind: 'error', message });
  }, []);

  return { feedback, showSuccess, showError, clear };
}

/** Pulls a readable message out of whatever the service layer threw. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}
