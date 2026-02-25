import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Recharge from './pages/Recharge';
import BuyNumber from './pages/BuyNumber';
import AwaitingNumber from './pages/AwaitingNumber';
import NumberDetails from './pages/NumberDetails';
import OperationDetails from './pages/OperationDetails';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { AdminPanel } from './pages/admin';
import ErrorNotification from './components/ErrorNotification';
import { ToastContainer, useToast } from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import { authService } from './services/auth';
import { operationsService } from './services/operations';
import { notificationSound } from './utils/notificationSound';
import { useTranslation } from './i18n';
import type { User, Country, Service, PhoneNumber, ApiError } from './types';

type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'admin'
  | 'recharge'
  | 'buy-number'
  | 'awaiting-number'
  | 'number-details'
  | 'operation-details'
  | 'payment-confirmation'
  | 'privacy-policy'
  | 'terms-of-service';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<PhoneNumber | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
  const [pendingFedapayDeposit, setPendingFedapayDeposit] = useState<{
    depositId: string;
    paymentUrl: string;
  } | null>(null);
  const [pendingOperation, setPendingOperation] = useState<{
    operationId: string;
    country: Country;
    service: Service;
  } | null>(null);
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);

  // Toast notifications
  const { toasts, removeToast, showError, showWarning } = useToast();

  // Translations
  const { t } = useTranslation();

  // Vérifier l'authentification au démarrage et gérer les callbacks FedaPay
  useEffect(() => {
    const initializeAuth = async () => {
      // Initialiser les préférences de notification
      notificationSound.loadUserPreferences();

      // Vérifier si c'est un retour de FedaPay (stocké dans sessionStorage par index.html)
      let fedapayCallback: { status: string; id: string; timestamp: number } | null = null;
      try {
        const storedCallback = sessionStorage.getItem('fedapay_callback');
        if (storedCallback) {
          fedapayCallback = JSON.parse(storedCallback);
          // Supprimer immédiatement pour éviter les doublons
          sessionStorage.removeItem('fedapay_callback');

          // Vérifier que le callback n'est pas trop vieux (5 minutes max)
          if (fedapayCallback && Date.now() - fedapayCallback.timestamp > 5 * 60 * 1000) {
            fedapayCallback = null;
          }
        }
      } catch {
        // Ignorer les erreurs de parsing
      }

      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);

          // Si retour de FedaPay, aller à la page de confirmation
          if (fedapayCallback) {
            setPendingFedapayDeposit({ depositId: fedapayCallback.id, paymentUrl: '' });
            setCurrentPage('payment-confirmation');
          } else {
            setCurrentPage('dashboard');
          }
        } catch {
          // Token invalide, on le supprime
          authService.logout();
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // Gestion des erreurs utilisateur
  const handleError = (err: unknown) => {
    const apiError = err as ApiError;
    setError(apiError.message || 'Une erreur inattendue est survenue');
  };

  const clearError = () => {
    setError(null);
  };

  // Authentification
  const handleLogin = async (emailOrUsername: string, password: string) => {
    try {
      // Nettoyage complet avant nouvelle connexion
      authService.clearAllData();
      setUser(null);
      setCurrentPhoneNumber(null);
      setError(null);
      
      await authService.login({ username: emailOrUsername, password });
      const currentUser = await authService.getCurrentUser();
      
      // Vérification supplémentaire des données utilisateur
      
      setUser(currentUser);
      setCurrentPage('dashboard');
    } catch (err) {
      // En cas d'erreur, s'assurer que tout est nettoyé
      authService.clearAllData();
      setUser(null);
      handleError(err);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      // Nettoyer les données précédentes
      setUser(null);
      setCurrentPhoneNumber(null);
      setError(null);
      
      await authService.register({ username, email, password });
      // Auto-connexion après inscription
      await authService.login({ username, password });
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setCurrentPage('dashboard');
    } catch (err) {
      handleError(err);
    }
  };


  // Rechargement via FedaPay
  const handleRecharge = async (depositId: string, paymentUrl: string) => {
    // Stocker les infos du dépôt
    setPendingFedapayDeposit({ depositId, paymentUrl });
    setCurrentPage('payment-confirmation');

    // Ouvrir FedaPay dans un nouvel onglet
    window.open(paymentUrl, '_blank');
  };

  // Messages d'erreur user-friendly
  const getErrorMessage = (error: string | undefined): { title: string; message: string } => {
    const errorLower = (error || '').toLowerCase();

    if (errorLower.includes('rate limit') || errorLower.includes('saturé')) {
      return {
        title: t.errors.serviceSaturated.title,
        message: t.errors.serviceSaturated.message
      };
    }
    if (errorLower.includes('indisponible') || errorLower.includes('unavailable')) {
      return {
        title: t.errors.numberUnavailable.title,
        message: t.errors.numberUnavailable.message
      };
    }
    if (errorLower.includes('fonds insuffisants') || errorLower.includes('insufficient')) {
      return {
        title: t.errors.insufficientFunds.title,
        message: t.errors.insufficientFunds.message
      };
    }
    if (errorLower.includes('non disponible') || errorLower.includes('not available')) {
      return {
        title: t.errors.serviceUnavailable.title,
        message: t.errors.serviceUnavailable.message
      };
    }
    // Intercepter les messages techniques du backend (fournisseur, non trouvé, etc.)
    if (errorLower.includes('fournisseur') || errorLower.includes('non trouvé') || errorLower.includes('not found') || errorLower.includes('provider')) {
      return {
        title: t.errors.numberUnavailable.title,
        message: t.errors.numberUnavailable.message
      };
    }

    return {
      title: t.common.error,
      message: error || t.errors.generic
    };
  };

  // Achat de numéro avec polling asynchrone
  const handleBuyNumber = async (country: Country, service: Service) => {
    try {
      // Créer l'opération (retourne immédiatement avec PROCESSING)
      const response = await operationsService.createOperation({
        serviceCode: service.code || service.id,
        countryCode: country.code
      });

      // Vérifier si l'opération a réussi
      if (!response.success || !response.operationId) {
        const { title, message } = getErrorMessage(response.message);
        showError(title, message);
        return; // Ne pas continuer vers la page d'attente
      }

      // Stocker les infos de l'opération en attente
      setPendingOperation({
        operationId: response.operationId,
        country,
        service
      });

      // Aller à la page d'attente
      setCurrentPage('awaiting-number');

      // Démarrer le polling pour attendre le numéro avant d'afficher la page
      startOperationPolling(response.operationId, country, service);
    } catch (err) {
      const apiError = err as ApiError;
      const { title, message } = getErrorMessage(apiError.message);
      showError(title, message);
    }
  };

  // Polling pour le statut des opérations asynchrones
  const startOperationPolling = (operationId: string, country?: Country, service?: Service) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await operationsService.getOperationStatus(operationId);

        // Vérifier si l'opération a échoué pendant qu'on attend le numéro
        if (statusResponse.status === 'FAILED' && pendingOperation) {
          clearInterval(pollInterval);
          setPendingOperation(null);
          setCurrentPage('buy-number');
          showWarning(
            t.errors.numberUnavailable.title,
            t.errors.numberUnavailable.message
          );
          return;
        }

        // Si nous attendons le numéro initial (première fois)
        if (!currentPhoneNumber && statusResponse.number && country && service) {
          const initialPhoneNumber: PhoneNumber = {
            id: operationId,
            number: statusResponse.number,
            country,
            service: {
              ...service,
              price: 0 // Prix sera mis à jour quand l'opération sera complète
            },
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            smsCode: statusResponse.sms,
            status: statusResponse.status,
            createdDate: new Date().toISOString()
          };

          setCurrentPhoneNumber(initialPhoneNumber);
          setPendingOperation(null); // Nettoyer l'opération en attente
          setCurrentPage('number-details');
        }

        if (currentPhoneNumber) {
          const previousSmsCode = currentPhoneNumber.smsCode;

          setCurrentPhoneNumber(prev => {
            if (!prev) return null;

            // Mettre à jour les infos selon le statut
            return {
              ...prev,
              number: statusResponse.number || prev.number,
              smsCode: statusResponse.sms,
              status: statusResponse.status
            };
          });

          // 🔊 Jouer le son si nouveau SMS reçu
          if (statusResponse.sms && statusResponse.sms !== previousSmsCode && statusResponse.status === 'SUCCESS') {
            try {
              await notificationSound.playNotificationSound();
            } catch {
              // Fallback si Web Audio API échoue
              notificationSound.playHTMLAudioNotification();
            }
          }

          // Mettre à jour le solde utilisateur quand l'opération est complète
          if (statusResponse.status === 'SUCCESS' || statusResponse.status === 'FAILED') {
            try {
              const updatedUser = await authService.getCurrentUser();
              setUser(updatedUser);
            } catch {
              // Erreur silencieuse
            }
            clearInterval(pollInterval);
          }
        }
      } catch {
        // Erreur silencieuse pour le polling
      }
    }, 3000); // Toutes les 3 secondes (plus fréquent pour une meilleure UX)

    // Nettoyer l'interval après 15 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 15 * 60 * 1000);
  };

  const handleRefreshCode = async () => {
    if (currentPhoneNumber) {
      try {
        const statusResponse = await operationsService.getOperationStatus(currentPhoneNumber.id);

        setCurrentPhoneNumber(prev => prev ? {
          ...prev,
          number: statusResponse.number || prev.number,
          smsCode: statusResponse.sms,
          status: statusResponse.status
        } : null);
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Déconnexion côté serveur + nettoyage localStorage
      await authService.logout();
    } catch {
      // En cas d'erreur, forcer le nettoyage local
      authService.clearAllData();
    }
    
    // Réinitialiser tous les états de l'application
    setUser(null);
    setCurrentPhoneNumber(null);
    setError(null);
    setCurrentPage('login');
    
    // Forcer un rechargement complet pour éliminer tout résidu
    window.location.reload();
  };

  // Écran de chargement initial
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === 'landing') {
      return (
        <LandingPage
          onGoToLogin={() => setCurrentPage('login')}
          onGoToRegister={() => setCurrentPage('register')}
          onGoToPrivacyPolicy={() => setCurrentPage('privacy-policy')}
          onGoToTermsOfService={() => setCurrentPage('terms-of-service')}
        />
      );
    }

    if (currentPage === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onForgotPassword={() => setCurrentPage('forgot-password')}
          onRegister={() => setCurrentPage('register')}
          onBackToHome={() => setCurrentPage('landing')}
        />
      );
    }

    if (currentPage === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => setCurrentPage('login')}
        />
      );
    }

    if (currentPage === 'forgot-password') {
      return (
        <ForgotPassword
          onBackToLogin={() => setCurrentPage('login')}
        />
      );
    }

    if (currentPage === 'privacy-policy') {
      return (
        <PrivacyPolicy
          onBack={() => setCurrentPage('landing')}
        />
      );
    }

    if (currentPage === 'terms-of-service') {
      return (
        <TermsOfService
          onBack={() => setCurrentPage('landing')}
        />
      );
    }

    // Protection des routes - rediriger vers login si pas d'utilisateur
    if (!user) {
      return (
        <Login
          onLogin={handleLogin}
          onForgotPassword={() => setCurrentPage('forgot-password')}
          onRegister={() => setCurrentPage('register')}
        />
      );
    }

    // Admin Panel - uniquement pour les admins
    if (currentPage === 'admin' && user.role === 'admin') {
      return (
        <AdminPanel
          onLogout={handleLogout}
        />
      );
    }

    if (currentPage === 'dashboard') {
      return (
        <Dashboard
          user={user}
          onRecharge={() => setCurrentPage('recharge')}
          onBuyNumber={() => setCurrentPage('buy-number')}
          onLogout={handleLogout}
          onViewOperation={(operationId: string) => {
            setSelectedOperationId(operationId);
            setCurrentPage('operation-details');
          }}
          onGoToAdmin={user.role === 'admin' ? () => setCurrentPage('admin') : undefined}
        />
      );
    }

    if (currentPage === 'recharge') {
      return (
        <Recharge
          onRecharge={handleRecharge}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
    }

    if (currentPage === 'buy-number') {
      return (
        <BuyNumber
          onBuyNumber={handleBuyNumber}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
    }

    if (currentPage === 'awaiting-number' && pendingOperation) {
      return (
        <AwaitingNumber
          country={pendingOperation.country}
          service={pendingOperation.service}
          onBack={() => {
            setPendingOperation(null);
            setCurrentPage('dashboard');
          }}
        />
      );
    }

    if (currentPage === 'number-details' && currentPhoneNumber) {
      return (
        <NumberDetails
          phoneNumber={currentPhoneNumber}
          onBack={() => setCurrentPage('dashboard')}
          onRefreshCode={handleRefreshCode}
        />
      );
    }

    if (currentPage === 'operation-details' && selectedOperationId) {
      return (
        <OperationDetails
          operationId={selectedOperationId}
          onBack={() => {
            setSelectedOperationId(null);
            setCurrentPage('dashboard');
          }}
        />
      );
    }

    if (currentPage === 'payment-confirmation' && (pendingTransactionId || pendingFedapayDeposit)) {
      return (
        <PaymentConfirmation
          transactionId={pendingTransactionId}
          fedapayDepositId={pendingFedapayDeposit?.depositId}
          fedapayPaymentUrl={pendingFedapayDeposit?.paymentUrl}
          onBackToDashboard={async () => {
            // Recharger les infos utilisateur pour mettre à jour le solde
            try {
              const updatedUser = await authService.getCurrentUser();
              setUser(updatedUser);
            } catch {
              // Erreur silencieuse mise à jour utilisateur
            }
            setPendingTransactionId(null);
            setPendingFedapayDeposit(null);
            setCurrentPage('dashboard');
          }}
        />
      );
    }

    // Par défaut, retour au dashboard
    return (
      <Dashboard
        user={user}
        onRecharge={() => setCurrentPage('recharge')}
        onBuyNumber={() => setCurrentPage('buy-number')}
        onLogout={handleLogout}
        onViewOperation={(operationId: string) => {
          setSelectedOperationId(operationId);
          setCurrentPage('operation-details');
        }}
        onGoToAdmin={user.role === 'admin' ? () => setCurrentPage('admin') : undefined}
      />
    );
  };

  return (
    <>
      {renderPage()}
      <ErrorNotification error={error} onClose={clearError} />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}