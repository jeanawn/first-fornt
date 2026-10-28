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
