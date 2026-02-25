import { useEffect } from 'react';

const BASE_TITLE = 'Xaary';

/**
 * Hook pour mettre à jour dynamiquement le titre de la page
 * Important pour le SEO et l'expérience utilisateur
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

/**
 * Titres prédéfinis pour chaque page de l'application
 */
export const PAGE_TITLES = {
  landing: 'Numéros virtuels pour vérification SMS',
  login: 'Connexion',
  register: 'Inscription',
  forgotPassword: 'Mot de passe oublié',
  dashboard: 'Tableau de bord',
  recharge: 'Recharger mon compte',
  buyNumber: 'Acheter un numéro',
  awaitingNumber: 'Attribution du numéro...',
  numberDetails: 'Détails du numéro',
  operationDetails: 'Détails de l\'opération',
  paymentConfirmation: 'Confirmation de paiement',
  privacyPolicy: 'Politique de confidentialité',
  termsOfService: 'Conditions d\'utilisation',
  admin: 'Administration',
  adminDashboard: 'Tableau de bord Admin',
  adminUsers: 'Gestion des utilisateurs',
  adminOperations: 'Gestion des opérations',
  adminTransactions: 'Gestion des transactions',
  adminServicePricing: 'Tarification des services',
  adminExchangeRates: 'Taux de change',
  adminAuditLogs: 'Journaux d\'audit',
} as const;

export default usePageTitle;
