export const fr = {
  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    search: 'Rechercher',
    noResults: 'Aucun résultat',
    retry: 'Réessayer',
    close: 'Fermer',
    copy: 'Copier',
    copied: 'Copié !',
    yes: 'Oui',
    no: 'Non',
  },

  // Landing Page
  landing: {
    nav: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      login: 'Connexion',
      register: "S'inscrire",
    },
    hero: {
      badge: 'Connectez-vous au monde',
      title: 'Connectez-vous au monde avec',
      subtitle: 'Accédez à des numéros virtuels temporaires du monde entier pour vos vérifications. Simple, sécurisé et instantané.',
      cta: 'Commencer gratuitement',
      discover: 'Découvrir les fonctionnalités',
    },
    stats: {
      countries: 'Pays couverts',
      successRate: 'Taux de réussite',
      support: 'Support',
    },
    features: {
      title: 'Pourquoi choisir Xaary ?',
      subtitle: 'Une plateforme simple et efficace pour vos besoins de vérification SMS.',
      coverage: {
        title: 'Couverture Mondiale',
        description: 'Accès aux numéros de plus de 10 pays africains',
      },
      instant: {
        title: 'Réception Instantanée',
        description: 'Recevez vos codes SMS en temps réel',
      },
      secure: {
        title: '100% Sécurisé',
        description: 'Vos données sont protégées et chiffrées',
      },
      pricing: {
        title: 'Prix Transparents',
        description: 'Tarifs compétitifs, paiement sécurisé',
      },
    },
    pricing: {
      title: 'Tarifs transparents',
      subtitle: '1 crédit = 1$. Simple, transparent, sans surprise.',
      popular: 'POPULAIRE',
      credits: 'crédits',
      perCredit: '/ crédit',
      features: {
        instantSms: 'SMS instantanés',
        allCountries: 'Tous les pays',
        support247: 'Support 24/7',
      },
      cta: 'Commencer',
    },
    cta: {
      title: 'Prêt à commencer avec Xaary ?',
      subtitle: 'Rejoignez des milliers d\'utilisateurs qui font confiance à Xaary pour leurs codes SMS.',
      createAccount: 'Créer mon compte gratuitement',
      haveAccount: 'J\'ai déjà un compte',
    },
    footer: {
      description: 'Connectez-vous au monde grâce à notre plateforme de numéros virtuels temporaires pour vos vérifications.',
      copyright: '© 2024 Xaary. Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
    },
  },

  // Auth
  auth: {
    login: {
      title: 'Connexion',
      subtitle: 'Accédez à votre compte Xaary',
      emailOrUsername: 'Email ou nom d\'utilisateur',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      submit: 'Se connecter',
      noAccount: 'Pas encore de compte ?',
      register: 'Créer un compte',
      backToHome: 'Retour à l\'accueil',
    },
    register: {
      title: 'Créer un compte',
      subtitle: 'Rejoignez Xaary gratuitement',
      username: 'Nom d\'utilisateur',
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Créer mon compte',
      haveAccount: 'Déjà un compte ?',
      login: 'Se connecter',
    },
    forgotPassword: {
      title: 'Mot de passe oublié',
      subtitle: 'Entrez votre email pour réinitialiser votre mot de passe',
      email: 'Adresse email',
      submit: 'Envoyer le lien',
      backToLogin: 'Retour à la connexion',
      successMessage: 'Un email de réinitialisation a été envoyé si le compte existe.',
    },
  },

  // Dashboard
  dashboard: {
    welcome: 'Bonjour',
    balance: 'Solde',
    recharge: 'Recharger',
    buyNumber: 'Acheter un numéro',
    recentOperations: 'Opérations récentes',
    noOperations: 'Aucune opération',
    noOperationsDesc: 'Vos achats de numéros apparaîtront ici',
    viewAll: 'Voir tout',
    admin: 'Administration',
    logout: 'Déconnexion',
    status: {
      pending: 'En attente',
      processing: 'Traitement',
      success: 'Terminé',
      failed: 'Échec',
    },
  },

  // Buy Number
  buyNumber: {
    title: 'Acheter un numéro',
    step1: {
      title: 'Étape 1 : Choisir le service',
      subtitle: 'WhatsApp, Telegram, Instagram...',
      searchPlaceholder: 'Rechercher un service...',
      noResults: 'Aucun service trouvé',
      tryAnother: 'Essayez un autre terme',
      services: 'services',
      countries: 'pays',
      startingFrom: 'à partir de',
      frequent: 'FRÉQUENT',
    },
    step2: {
      title: 'Choisir le pays',
      subtitle: 'Pays disponibles',
      searchPlaceholder: 'Rechercher un pays...',
      noResults: 'Aucun pays trouvé',
      countriesWithPrices: 'pays avec tarifs',
      change: 'Changer',
    },
    instructions: {
      title: 'Comment ça marche',
      step1: 'Cliquez sur le pays de votre choix',
      step2: 'L\'achat se déclenche automatiquement',
      step3: 'Votre numéro sera prêt instantanément',
    },
  },

  // Awaiting Number
  awaitingNumber: {
    title: 'Préparation en cours',
    subtitle: 'Obtention du numéro virtuel',
    status: 'Opération en cours',
    gettingNumber: 'Obtention du numéro',
    waitMessage: 'Cela peut prendre quelques instants',
    orderDetails: 'Votre commande',
    orderSubtitle: 'Détails de l\'achat en cours',
    country: 'Pays',
    service: 'Service',
    steps: {
      title: 'Étapes en cours',
      validated: 'Commande validée',
      attributing: 'Attribution du numéro en cours',
      waitingSms: 'En attente du SMS',
    },
    guarantee: {
      title: 'Garantie automatique',
      message: 'Si aucun numéro n\'est attribué dans les 5 prochaines minutes, votre solde sera automatiquement remboursé.',
    },
  },

  // Number Details
  numberDetails: {
    title: 'Numéro virtuel',
    createdAt: 'Créé le',
    status: 'Statut de l\'opération',
    info: {
      title: 'Informations',
      subtitle: 'Détails du numéro virtuel',
    },
    country: 'Pays',
    service: 'Service',
    phoneNumber: 'Numéro de téléphone',
    numberCopied: 'Numéro copié !',
    timeRemaining: 'Temps restant',
    smsCode: {
      title: 'Code SMS',
      subtitle: 'Code de vérification reçu',
      received: 'Code reçu !',
      copyCode: 'Copier le code',
      waiting: 'En attente du SMS',
      processing: 'Traitement en cours',
      autoCheck: 'Vérification automatique toutes les 10 secondes',
      willAppear: 'Le code apparaîtra automatiquement dès réception',
      willBeAssigned: 'Le numéro sera attribué automatiquement',
      failed: 'Opération échouée',
      noSms: 'Aucun SMS n\'a été reçu pour ce numéro',
    },
    guarantee: {
      title: 'Garantie 100% Remboursement',
      message: 'Si vous ne recevez pas de code SMS dans les 15 minutes, votre solde sera automatiquement remboursé. Pas besoin de contacter le support !',
      auto: 'Remboursement automatique • Aucune démarche requise',
    },
    instructions: {
      title: 'Instructions d\'utilisation',
      step1: 'Copiez le numéro de téléphone ci-dessus',
      step2: 'Utilisez-le pour vous inscrire sur',
      step3: 'Le code SMS apparaîtra automatiquement ici',
      step4: 'Copiez et utilisez le code pour confirmer votre inscription',
    },
  },

  // Recharge
  recharge: {
    title: 'Recharger',
    subtitle: 'Ajoutez des crédits à votre compte',
    amount: 'Montant',
    phone: 'Numéro de téléphone',
    phonePlaceholder: 'Ex: 77 123 45 67',
    network: 'Réseau',
    selectNetwork: 'Sélectionnez un réseau',
    summary: 'Récapitulatif',
    youPay: 'Vous payez',
    youReceive: 'Vous recevez',
    submit: 'Procéder au paiement',
    instructions: {
      title: 'Comment ça marche',
      step1: 'Entrez le montant à recharger',
      step2: 'Saisissez votre numéro de téléphone',
      step3: 'Validez le paiement sur votre téléphone',
    },
  },

  // Payment Confirmation
  paymentConfirmation: {
    verifying: 'Vérification du paiement...',
    fetchingInfo: 'Récupération des informations de transaction',
    success: {
      title: 'Paiement réussi !',
      message: 'Votre recharge de {amount} $ a été confirmée',
    },
    failed: {
      title: 'Paiement échoué',
      message: 'Le paiement de {amount} $ n\'a pas pu être traité',
    },
    pending: {
      title: 'Paiement en cours...',
      message: 'Vérification du paiement de {amount} $',
    },
    details: {
      title: 'Détails de la transaction',
      transactionId: 'ID Transaction',
      amount: 'Montant',
      phone: 'Téléphone',
      network: 'Réseau',
      status: 'Statut',
      confirmed: 'Confirmé',
      failedStatus: 'Échec',
      pendingStatus: 'En attente',
    },
    instructions: {
      title: 'Instructions',
      step1: 'Vérifiez votre téléphone',
      step2: 'Composez le code proposé ou confirmez avec votre PIN',
      step3: 'Le statut sera mis à jour automatiquement',
    },
    backToDashboard: 'Retour au tableau de bord',
    forceReturn: 'Forcer le retour',
    checkingEvery: 'Vérification en cours... (toutes les 3 secondes)',
    autoTimeout: 'Timeout automatique dans',
    autoRedirect: 'Redirection automatique dans',
    securedBy: 'Transaction sécurisée par votre opérateur mobile',
  },

  // Errors
  errors: {
    generic: 'Une erreur est survenue. Veuillez réessayer.',
    numberUnavailable: {
      title: 'Numéro indisponible',
      message: 'Aucun numéro disponible pour ce service et ce pays. Essayez un autre pays.',
    },
    serviceSaturated: {
      title: 'Service saturé',
      message: 'Trop de demandes en cours. Veuillez réessayer dans quelques minutes.',
    },
    insufficientFunds: {
      title: 'Solde insuffisant',
      message: 'Votre solde est insuffisant pour cette opération. Rechargez votre compte.',
    },
    serviceUnavailable: {
      title: 'Service non disponible',
      message: 'Ce service n\'est pas disponible pour ce pays actuellement.',
    },
    networkError: {
      title: 'Erreur réseau',
      message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
    },
  },

  // Language
  language: {
    switch: 'Langue',
    fr: 'Français',
    en: 'English',
  },
};

export type Translations = typeof fr;
