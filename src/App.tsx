import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Recharge from './pages/Recharge';
import BuyNumber from './pages/BuyNumber';
import NumberDetails from './pages/NumberDetails';
import PaymentConfirmation from './pages/PaymentConfirmation';
import ErrorNotification from './components/ErrorNotification';
import LoadingSpinner from './components/LoadingSpinner';
import { authService } from './services/auth';
import { balanceService } from './services/balance';
import { operationsService } from './services/operations';
import { notificationSound } from './utils/notificationSound';
import type { User, Country, Service, PhoneNumber, Network, ApiError } from './types';

type Page = 
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password' 
  | 'dashboard' 
  | 'recharge' 
  | 'buy-number' 
  | 'number-details'
  | 'payment-confirmation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<PhoneNumber | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentData, setPaymentData] = useState<{amount: string, phoneNumber: string, networkName: string} | null>(null);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      // Initialiser les préférences de notification
      notificationSound.loadUserPreferences();
      
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setCurrentPage('dashboard');
        } catch {
          // Token invalide, on le supprime
          authService.logout();
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // Gestion des erreurs
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
      console.log('Utilisateur connecté:', currentUser);
      
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

  const handleForgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (err) {
      handleError(err);
    }
  };

  // Rechargement
  const handleRecharge = async (amount: number, phoneNumber: string, network: Network) => {
    try {
      await balanceService.loadBalance({
        amount: amount, // Montant direct, pas de conversion
        phoneNumber,
        network: network.id
      });
      
      // Stocker les données de paiement pour la page de confirmation
      setPaymentData({
        amount: amount.toString(),
        phoneNumber,
        networkName: network.name
      });
      
      // Rediriger vers la page de confirmation
      setCurrentPage('payment-confirmation');
    } catch (err) {
      handleError(err);
    }
  };

  // Achat de numéro
  const handleBuyNumber = async (country: Country, service: Service) => {
    try {
      const operation = await operationsService.createOperation({
        serviceCode: service.code || service.id,
        countryCode: country.code
      });

      // Créer l'objet PhoneNumber à partir de l'opération
      const newPhoneNumber: PhoneNumber = {
        id: operation.id,
        number: operation.number,
        country,
        service: {
          ...service,
          price: operation.price / 100 // Convertir de centimes vers euros
        },
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        smsCode: operation.sms,
        status: operation.status,
        createdDate: operation.createdDate
      };

      // Recharger les infos utilisateur pour mettre à jour le solde
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      
      setCurrentPhoneNumber(newPhoneNumber);
      setCurrentPage('number-details');

      // Démarrer le polling pour vérifier les SMS
      startSmsPolling(operation.id);
    } catch (err) {
      handleError(err);
    }
  };

  // Polling pour les SMS
  const startSmsPolling = (operationId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const operation = await operationsService.getOperationById(operationId);
        if (operation && currentPhoneNumber) {
          const previousSmsCode = currentPhoneNumber.smsCode;
          
          setCurrentPhoneNumber(prev => prev ? {
            ...prev,
            smsCode: operation.sms,
            status: operation.status
          } : null);

          // 🔊 Jouer le son si nouveau SMS reçu
          if (operation.sms && operation.sms !== previousSmsCode && operation.status === 'SUCCESS') {
            try {
              await notificationSound.playNotificationSound();
            } catch (error) {
              // Fallback si Web Audio API échoue
              notificationSound.playHTMLAudioNotification();
            }
          }

          // Arrêter le polling si SMS reçu ou échec
          if (operation.status === 'SUCCESS' || operation.status === 'FAILED') {
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        // Erreur silencieuse pour le polling
        console.error('Erreur polling SMS:', err);
      }
    }, 30000); // Toutes les 30 secondes

    // Nettoyer l'interval après 15 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 15 * 60 * 1000);
  };

  const handleRefreshCode = async () => {
    if (currentPhoneNumber) {
      try {
        const operation = await operationsService.getOperationById(currentPhoneNumber.id);
        if (operation) {
          setCurrentPhoneNumber(prev => prev ? {
            ...prev,
            smsCode: operation.sms,
            status: operation.status
          } : null);
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Déconnexion côté serveur + nettoyage localStorage
      await authService.logout();
    } catch (error) {
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
          onResetPassword={handleForgotPassword}
          onBackToLogin={() => setCurrentPage('login')}
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

    if (currentPage === 'dashboard') {
      return (
        <Dashboard
          user={user}
          onRecharge={() => setCurrentPage('recharge')}
          onBuyNumber={() => setCurrentPage('buy-number')}
          onLogout={handleLogout}
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

    if (currentPage === 'number-details' && currentPhoneNumber) {
      return (
        <NumberDetails
          phoneNumber={currentPhoneNumber}
          onBack={() => setCurrentPage('dashboard')}
          onRefreshCode={handleRefreshCode}
        />
      );
    }

    if (currentPage === 'payment-confirmation' && paymentData) {
      return (
        <PaymentConfirmation
          amount={paymentData.amount}
          phoneNumber={paymentData.phoneNumber}
          networkName={paymentData.networkName}
          onBackToDashboard={async () => {
            // Recharger les infos utilisateur pour mettre à jour le solde
            try {
              const updatedUser = await authService.getCurrentUser();
              setUser(updatedUser);
            } catch (err) {
              console.error('Erreur mise à jour utilisateur:', err);
            }
            setPaymentData(null);
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
      />
    );
  };

  return (
    <>
      {renderPage()}
      <ErrorNotification error={error} onClose={clearError} />
    </>
  );
}