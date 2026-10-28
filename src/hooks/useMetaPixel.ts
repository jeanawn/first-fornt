import { useEffect, useRef } from 'react';

type FbqArgs = [track: string, event: string, params?: Record<string, unknown>];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
  }
}

/**
 * Envoie un evenement au pixel Meta si le script est charge
 * (bloqueur de pub, mode hors ligne : fbq peut etre absent)
 */
export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  window.fbq?.('track', event, params);
}

const PURCHASE_LOG_KEY = 'fb_tracked_purchases';
const PURCHASE_LOG_SIZE = 50;

function readTrackedPurchases(): string[] {
  try {
    const raw = localStorage.getItem(PURCHASE_LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Envoie l'evenement Purchase une seule fois par reference de paiement
 * Le polling de PaymentConfirmation repasse plusieurs fois sur le statut
 * approuve, et un rechargement de page rejouerait l'evenement : on garde
 * donc les references deja envoyees dans localStorage
 *
 * Les montants sont en XOF, devise sans decimale
 */
export function trackPurchaseOnce(reference: string, amount: number) {
  if (!reference || !Number.isFinite(amount) || amount <= 0) return;

  const tracked = readTrackedPurchases();
  if (tracked.includes(reference)) return;

  try {
    const updated = [reference, ...tracked].slice(0, PURCHASE_LOG_SIZE);
    localStorage.setItem(PURCHASE_LOG_KEY, JSON.stringify(updated));
  } catch {
    // Stockage indisponible : on envoie quand meme, quitte a doublonner
  }

  trackPixelEvent('Purchase', {
    value: Math.round(amount),
    currency: 'XOF',
  });
}

/**
 * Hook pour suivre les changements de page dans la SPA
 * Le premier PageView est deja envoye par le script dans index.html,
 * on ne declenche donc que les navigations suivantes
 */
export function useMetaPixelPageView(page: string) {
  const previousPage = useRef(page);

  useEffect(() => {
    if (previousPage.current === page) return;
    previousPage.current = page;
    trackPixelEvent('PageView');
  }, [page]);
}

export default useMetaPixelPageView;
