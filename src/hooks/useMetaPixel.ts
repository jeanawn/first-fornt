import { useEffect, useRef } from 'react';
import { PIXEL_LOG_PREFIX } from '../utils/storage';

type FbqArgs = [track: string, event: string, params?: Record<string, unknown>];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
  }
}

/** Devise unique de la plateforme, XOF : montants entiers, sans decimale */
const CURRENCY = 'XOF';

/** Categorie commune a tous les produits du catalogue */
const CONTENT_CATEGORY = 'virtual_number';

/**
 * Envoie un evenement au pixel Meta si le script est charge
 * (bloqueur de pub, mode hors ligne : fbq peut etre absent)
 */
export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  window.fbq?.('track', event, params);
}

/**
 * Envoie un evenement personnalise, hors catalogue standard Meta
 */
export function trackCustomPixelEvent(event: string, params?: Record<string, unknown>) {
  window.fbq?.('trackCustom', event, params);
}

const TRACKED_LOG_SIZE = 50;

function readTrackedLog(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Envoie un evenement une seule fois par reference metier
 * Les pages de paiement rejouent leur polling plusieurs fois sur le meme
 * statut, et un rechargement de page relancerait l'evenement : on garde
 * donc les references deja envoyees dans localStorage
 */
function trackEventOnce(
  storageKey: string,
  reference: string,
  event: string,
  params?: Record<string, unknown>,
  send: (event: string, params?: Record<string, unknown>) => void = trackPixelEvent
) {
  if (!reference) return;

  const tracked = readTrackedLog(storageKey);
  if (tracked.includes(reference)) return;

  try {
    const updated = [reference, ...tracked].slice(0, TRACKED_LOG_SIZE);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch {
    // Stockage indisponible : on envoie quand meme, quitte a doublonner
  }

  send(event, params);
}

function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0;
}

const PURCHASE_LOG_KEY = `${PIXEL_LOG_PREFIX}purchases`;
const PAYMENT_INFO_LOG_KEY = `${PIXEL_LOG_PREFIX}payment_infos`;
const NUMBER_PURCHASE_LOG_KEY = `${PIXEL_LOG_PREFIX}number_purchases`;

/**
 * Achat confirme : envoye une seule fois par reference de paiement
 */
export function trackPurchaseOnce(reference: string, amount: number) {
  if (!isValidAmount(amount)) return;

  trackEventOnce(PURCHASE_LOG_KEY, reference, 'Purchase', {
    value: Math.round(amount),
    currency: CURRENCY,
  });
}

/**
 * Vue du contenu : l'utilisateur ouvre la fiche d'un service
 * Le prix transmis est le prix d'appel, le pays n'etant pas encore choisi
 */
export function trackViewContent(service: { code: string; name: string; minPrice: number }) {
  trackPixelEvent('ViewContent', {
    content_type: 'product',
    content_ids: [service.code],
    content_name: service.name,
    content_category: CONTENT_CATEGORY,
    ...(isValidAmount(service.minPrice)
      ? { value: Math.round(service.minPrice), currency: CURRENCY }
      : {}),
  });
}

/**
 * Ajout au panier : service et pays choisis, le prix final est connu
 */
export function trackAddToCart(
  service: { code: string; name: string },
  country: { code: string; name: string; price: number }
) {
  trackPixelEvent('AddToCart', {
    content_type: 'product',
    content_ids: [`${service.code}_${country.code}`],
    content_name: `${service.name} - ${country.name}`,
    content_category: CONTENT_CATEGORY,
    contents: [{ id: `${service.code}_${country.code}`, quantity: 1 }],
    ...(isValidAmount(country.price)
      ? { value: Math.round(country.price), currency: CURRENCY }
      : {}),
  });
}

/**
 * Debut du paiement : le formulaire de recharge est valide et envoye
 */
export function trackInitiateCheckout(amount: number) {
  if (!isValidAmount(amount)) return;

  trackPixelEvent('InitiateCheckout', {
    content_category: 'wallet_topup',
    num_items: 1,
    value: Math.round(amount),
    currency: CURRENCY,
  });
}

/**
 * Ajout des informations de paiement : la page de paiement FedaPay est ouverte
 * Elle peut etre rouverte depuis la page de confirmation, d'ou le dedoublonnage
 */
export function trackAddPaymentInfoOnce(reference: string, amount: number) {
  if (!isValidAmount(amount)) return;

  trackEventOnce(PAYMENT_INFO_LOG_KEY, reference, 'AddPaymentInfo', {
    content_category: 'wallet_topup',
    value: Math.round(amount),
    currency: CURRENCY,
  });
}

/**
 * Achat d'un numero regle sur le solde du compte
 *
 * Evenement personnalise et non Purchase : la recharge du solde est deja
 * comptee comme Purchase, reutiliser l'evenement standard doublerait le
 * chiffre d'affaires remonte a Meta. La valeur reste transmise, un
 * evenement personnalise n'alimentant pas la colonne Achats
 */
export function trackNumberPurchaseOnce(
  operationId: string,
  service: { code?: string; id: string; name: string; price: number },
  country: { code: string; name: string }
) {
  // Meme identifiant que AddToCart, pour relier panier et achat
  const contentId = `${service.code || service.id}_${country.code}`;

  trackEventOnce(
    NUMBER_PURCHASE_LOG_KEY,
    operationId,
    'NumberPurchased',
    {
      content_type: 'product',
      content_ids: [contentId],
      content_name: `${service.name} - ${country.name}`,
      content_category: CONTENT_CATEGORY,
      contents: [{ id: contentId, quantity: 1 }],
      ...(isValidAmount(service.price)
        ? { value: Math.round(service.price), currency: CURRENCY }
        : {}),
    },
    trackCustomPixelEvent
  );
}

/**
 * Connexion a un compte existant
 *
 * Evenement personnalise : Meta n'a pas d'evenement standard pour la
 * connexion. Volontairement non dedoublonne, chaque session comptant
 */
export function trackLogin(params?: Record<string, unknown>) {
  trackCustomPixelEvent('Login', {
    content_name: 'login',
    content_category: 'account',
    ...params,
  });
}

/**
 * Deconnexion du compte
 *
 * Evenement personnalise, Meta n'ayant pas d'evenement standard.
 * A envoyer avant tout nettoyage ou rechargement de page : le pixel
 * emet sa requete de maniere asynchrone et un reload la couperait
 */
export function trackLogout(params?: Record<string, unknown>) {
  trackCustomPixelEvent('Logout', {
    content_name: 'logout',
    content_category: 'account',
    ...params,
  });
}

/**
 * Lead : un compte vient d'etre cree
 */
export function trackLead(params?: Record<string, unknown>) {
  trackPixelEvent('Lead', {
    content_name: 'signup',
    content_category: 'account',
    ...params,
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
