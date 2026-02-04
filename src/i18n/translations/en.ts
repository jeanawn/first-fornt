import type { Translations } from './fr';

export const en: Translations = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    search: 'Search',
    noResults: 'No results',
    retry: 'Retry',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied!',
    yes: 'Yes',
    no: 'No',
  },

  // Landing Page
  landing: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      login: 'Login',
      register: 'Sign up',
    },
    hero: {
      badge: 'Connect to the world',
      title: 'Connect to the world with',
      subtitle: 'Access temporary virtual numbers from around the world for your verifications. Simple, secure and instant.',
      cta: 'Get started for free',
      discover: 'Discover features',
    },
    stats: {
      countries: 'Countries covered',
      successRate: 'Success rate',
      support: 'Support',
    },
    features: {
      title: 'Why choose Xaary?',
      subtitle: 'A simple and effective platform for your SMS verification needs.',
      coverage: {
        title: 'Global Coverage',
        description: 'Access to numbers from over 10 African countries',
      },
      instant: {
        title: 'Instant Reception',
        description: 'Receive your SMS codes in real time',
      },
      secure: {
        title: '100% Secure',
        description: 'Your data is protected and encrypted',
      },
      pricing: {
        title: 'Transparent Pricing',
        description: 'Competitive rates, secure payment',
      },
    },
    pricing: {
      title: 'Transparent pricing',
      subtitle: 'Temporary numbers starting from $2. Simple, transparent, no surprises.',
      popular: 'POPULAR',
      credits: 'credits',
      perCredit: '/ credit',
      features: {
        instantSms: 'Instant SMS',
        allCountries: 'All countries',
        support247: '24/7 Support',
      },
      cta: 'Get started',
    },
    cta: {
      title: 'Ready to start with Xaary?',
      subtitle: 'Join thousands of users who trust Xaary for their SMS codes.',
      createAccount: 'Create my account for free',
      haveAccount: 'I already have an account',
    },
    footer: {
      description: 'Connect to the world through our platform of temporary virtual numbers for your verifications.',
      copyright: '© 2024 Xaary. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },

  // Auth
  auth: {
    login: {
      title: 'Login',
      subtitle: 'Access your Xaary account',
      emailOrUsername: 'Email or username',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      submit: 'Sign in',
      noAccount: "Don't have an account?",
      register: 'Create an account',
      backToHome: 'Back to home',
    },
    register: {
      title: 'Create an account',
      subtitle: 'Join Xaary for free',
      username: 'Username',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      submit: 'Create my account',
      haveAccount: 'Already have an account?',
      login: 'Sign in',
    },
    forgotPassword: {
      title: 'Forgot password',
      subtitle: 'Enter your email to reset your password',
      email: 'Email address',
      submit: 'Send reset link',
      backToLogin: 'Back to login',
      successMessage: 'A reset email has been sent if the account exists.',
    },
  },

  // Dashboard
  dashboard: {
    welcome: 'Hello',
    balance: 'Balance',
    recharge: 'Top up',
    buyNumber: 'Buy a number',
    recentOperations: 'Recent operations',
    noOperations: 'No operations',
    noOperationsDesc: 'Your number purchases will appear here',
    viewAll: 'View all',
    admin: 'Administration',
    logout: 'Logout',
    status: {
      pending: 'Pending',
      processing: 'Processing',
      success: 'Completed',
      failed: 'Failed',
    },
  },

  // Buy Number
  buyNumber: {
    title: 'Buy a number',
    step1: {
      title: 'Step 1: Choose the service',
      subtitle: 'WhatsApp, Telegram, Instagram...',
      searchPlaceholder: 'Search for a service...',
      noResults: 'No service found',
      tryAnother: 'Try another term',
      services: 'services',
      countries: 'countries',
      startingFrom: 'starting from',
      frequent: 'FREQUENT',
    },
    step2: {
      title: 'Choose the country',
      subtitle: 'Available countries',
      searchPlaceholder: 'Search for a country...',
      noResults: 'No country found',
      countriesWithPrices: 'countries with prices',
      change: 'Change',
    },
    instructions: {
      title: 'How it works',
      step1: 'Click on the country of your choice',
      step2: 'The purchase starts automatically',
      step3: 'Your number will be ready instantly',
    },
  },

  // Awaiting Number
  awaitingNumber: {
    title: 'Preparation in progress',
    subtitle: 'Getting your virtual number',
    status: 'Operation in progress',
    gettingNumber: 'Getting number',
    waitMessage: 'This may take a few moments',
    orderDetails: 'Your order',
    orderSubtitle: 'Details of the purchase in progress',
    country: 'Country',
    service: 'Service',
    steps: {
      title: 'Steps in progress',
      validated: 'Order validated',
      attributing: 'Number attribution in progress',
      waitingSms: 'Waiting for SMS',
    },
    guarantee: {
      title: 'Automatic guarantee',
      message: 'If no number is assigned within the next 5 minutes, your balance will be automatically refunded.',
    },
  },

  // Number Details
  numberDetails: {
    title: 'Virtual number',
    createdAt: 'Created on',
    status: 'Operation status',
    info: {
      title: 'Information',
      subtitle: 'Virtual number details',
    },
    country: 'Country',
    service: 'Service',
    phoneNumber: 'Phone number',
    numberCopied: 'Number copied!',
    timeRemaining: 'Time remaining',
    smsCode: {
      title: 'SMS Code',
      subtitle: 'Verification code received',
      received: 'Code received!',
      copyCode: 'Copy code',
      waiting: 'Waiting for SMS',
      processing: 'Processing',
      autoCheck: 'Automatic check every 10 seconds',
      willAppear: 'The code will appear automatically when received',
      willBeAssigned: 'The number will be assigned automatically',
      failed: 'Operation failed',
      noSms: 'No SMS was received for this number',
    },
    guarantee: {
      title: '100% Refund Guarantee',
      message: 'If you don\'t receive an SMS code within 15 minutes, your balance will be automatically refunded. No need to contact support!',
      auto: 'Automatic refund • No action required',
    },
    instructions: {
      title: 'Instructions',
      step1: 'Copy the phone number above',
      step2: 'Use it to register on',
      step3: 'The SMS code will appear here automatically',
      step4: 'Copy and use the code to confirm your registration',
    },
  },

  // Recharge
  recharge: {
    title: 'Top up',
    subtitle: 'Add credits to your account',
    amount: 'Amount',
    phone: 'Phone number',
    phonePlaceholder: 'Ex: 77 123 45 67',
    network: 'Network',
    selectNetwork: 'Select a network',
    summary: 'Summary',
    youPay: 'You pay',
    youReceive: 'You receive',
    submit: 'Proceed to payment',
    instructions: {
      title: 'How it works',
      step1: 'Enter the amount to top up',
      step2: 'Enter your phone number',
      step3: 'Validate the payment on your phone',
    },
  },

  // Payment Confirmation
  paymentConfirmation: {
    verifying: 'Verifying payment...',
    fetchingInfo: 'Fetching transaction information',
    success: {
      title: 'Payment successful!',
      message: 'Your top-up of ${amount} has been confirmed',
    },
    failed: {
      title: 'Payment failed',
      message: 'The payment of ${amount} could not be processed',
    },
    pending: {
      title: 'Payment in progress...',
      message: 'Verifying payment of ${amount}',
    },
    details: {
      title: 'Transaction details',
      transactionId: 'Transaction ID',
      amount: 'Amount',
      phone: 'Phone',
      network: 'Network',
      status: 'Status',
      confirmed: 'Confirmed',
      failedStatus: 'Failed',
      pendingStatus: 'Pending',
    },
    instructions: {
      title: 'Instructions',
      step1: 'Check your phone',
      step2: 'Enter the code or confirm with your PIN',
      step3: 'The status will be updated automatically',
    },
    backToDashboard: 'Back to dashboard',
    forceReturn: 'Force return',
    checkingEvery: 'Checking... (every 3 seconds)',
    autoTimeout: 'Auto timeout in',
    autoRedirect: 'Auto redirect in',
    securedBy: 'Transaction secured by your mobile operator',
  },

  // Errors
  errors: {
    generic: 'An error occurred. Please try again.',
    numberUnavailable: {
      title: 'Number unavailable',
      message: 'No number available for this service and country. Try another country.',
    },
    serviceSaturated: {
      title: 'Service saturated',
      message: 'Too many requests in progress. Please try again in a few minutes.',
    },
    insufficientFunds: {
      title: 'Insufficient balance',
      message: 'Your balance is insufficient for this operation. Top up your account.',
    },
    serviceUnavailable: {
      title: 'Service unavailable',
      message: 'This service is not available for this country currently.',
    },
    networkError: {
      title: 'Network error',
      message: 'Unable to connect to server. Check your internet connection.',
    },
  },

  // Language
  language: {
    switch: 'Language',
    fr: 'Français',
    en: 'English',
  },
};
