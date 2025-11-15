import { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import { usePasswordReset } from '../hooks/usePasswordReset';

type FlowStep = 'email' | 'otp' | 'password' | 'success';

interface ForgotPasswordProps {
  onResetPassword?: (email: string) => void;
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { state, error, sendOtp, verifyOtp, resetPassword, clearError } = usePasswordReset();

  const isLoading = ['SENDING_OTP', 'VERIFYING_OTP', 'RESETTING'].includes(state);

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const maskedLocal = localPart.charAt(0) + '***';
    return `${maskedLocal}@${domain}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await sendOtp(email);
      setCurrentStep('otp');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // Error handled by hook
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await verifyOtp(email, otpCode);
      setCurrentStep('password');
    } catch {
      // Error handled by hook
    }
  };

  const getPasswordValidationError = () => {
    if (!newPassword && !confirmPassword) return '';
    if (newPassword.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (newPassword !== confirmPassword) return 'Les mots de passe ne correspondent pas';
    return '';
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = getPasswordValidationError();
    if (validationError) {
      return;
    }

    clearError();

    try {
      await resetPassword(email, otpCode, newPassword);
      setCurrentStep('success');
    } catch {
      // Error handled by hook
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    clearError();

    try {
      await sendOtp(email);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // Error handled by hook
    }
  };

  // Étape 1 : Saisie de l'email
  const renderEmailStep = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Réinitialisation</h2>
        <p className="text-gray-600 text-sm">
          Entrez votre adresse email pour recevoir un code de vérification
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <label className="block text-sm font-semibold text-gray-900">Adresse email</label>
          </div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
            className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
        >
          <div className="flex items-center justify-center space-x-3">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Envoyer le code</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );

  // Étape 2 : Vérification du code OTP
  const renderOtpStep = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Code de vérification</h2>
        <p className="text-gray-600 text-sm">
          Un code à 6 chiffres a été envoyé à <strong>{maskEmail(email)}</strong>
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <label className="block text-sm font-semibold text-gray-900">Code de vérification</label>
          </div>
          <Input
            type="text"
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(value);
            }}
            required
            placeholder="123456"
            className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-center font-mono tracking-widest"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Saisissez les 6 chiffres reçus par email
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otpCode.length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
        >
          <div className="flex items-center justify-center space-x-3">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Vérifier le code</span>
              </>
            )}
          </div>
        </button>

        <div className="text-center pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={countdown > 0 || isLoading}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {countdown > 0
              ? `Renvoyer le code dans ${countdown}s`
              : 'Renvoyer le code'
            }
          </button>
        </div>
      </form>
    </div>
  );

  // Étape 3 : Nouveau mot de passe
  const renderPasswordStep = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h2>
        <p className="text-gray-600 text-sm">
          Choisissez un nouveau mot de passe sécurisé
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <label className="block text-sm font-semibold text-gray-900">Nouveau mot de passe</label>
          </div>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Minimum 6 caractères"
            className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <label className="block text-sm font-semibold text-gray-900">Confirmer le mot de passe</label>
          </div>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirmez votre mot de passe"
            className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
          />
        </div>

        {/* Indicateur de force du mot de passe */}
        {newPassword.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Force du mot de passe :</h4>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center space-x-2 ${newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={newPassword.length >= 6 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                </svg>
                <span>Au moins 6 caractères</span>
              </div>
              <div className={`flex items-center space-x-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/[A-Z]/.test(newPassword) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                </svg>
                <span>Une majuscule (recommandé)</span>
              </div>
              <div className={`flex items-center space-x-2 ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/[0-9]/.test(newPassword) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                </svg>
                <span>Un chiffre (recommandé)</span>
              </div>
            </div>
          </div>
        )}

        {(error || getPasswordValidationError()) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">{error || getPasswordValidationError()}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
        >
          <div className="flex items-center justify-center space-x-3">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Réinitialisation...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Réinitialiser le mot de passe</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );

  // Étape 4 : Succès
  const renderSuccessStep = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Mot de passe réinitialisé ! ✅
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Votre mot de passe a été mis à jour avec succès.
        </p>
      </div>

      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-green-900">Vous pouvez maintenant :</h3>
        </div>
        <p className="text-green-800 text-sm">
          Vous connecter avec votre nouvelle mot de passe
        </p>
      </div>

      <button
        onClick={onBackToLogin}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
      >
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
          <span>Se connecter</span>
        </div>
      </button>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email': return 'Mot de passe oublié ?';
      case 'otp': return 'Vérification';
      case 'password': return 'Nouveau mot de passe';
      case 'success': return 'Terminé !';
      default: return 'Réinitialisation';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'email': return 'Pas de souci, nous allons vous aider';
      case 'otp': return 'Entrez le code reçu par email';
      case 'password': return 'Choisissez votre nouveau mot de passe';
      case 'success': return 'Votre mot de passe a été mis à jour';
      default: return '';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'email': return (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
      case 'otp': return (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      case 'password': return (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
      case 'success': return (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      default: return null;
    }
  };

  const getStepColor = () => {
    switch (currentStep) {
      case 'email': return 'from-orange-500 to-red-600';
      case 'otp': return 'from-blue-500 to-indigo-600';
      case 'password': return 'from-green-500 to-emerald-600';
      case 'success': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStepProgressWidth = () => {
    switch (currentStep) {
      case 'email': return '25%';
      case 'otp': return '50%';
      case 'password': return '75%';
      case 'success': return '100%';
      default: return '0%';
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: getStepProgressWidth() }}
            ></div>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 bg-gradient-to-br ${getStepColor()} rounded-3xl mx-auto flex items-center justify-center shadow-xl`}>
              {getStepIcon()}
            </div>
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${getStepColor().replace('to-br', 'to-r')} bg-clip-text text-transparent`}>
                {getStepTitle()}
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                {getStepSubtitle()}
              </p>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'email' && renderEmailStep()}
          {currentStep === 'otp' && renderOtpStep()}
          {currentStep === 'password' && renderPasswordStep()}
          {currentStep === 'success' && renderSuccessStep()}

          {/* Back to Login - Show on all steps except success */}
          {currentStep !== 'success' && (
            <div className="text-center">
              <button
                onClick={onBackToLogin}
                className="text-gray-600 hover:text-orange-600 text-sm font-medium transition-colors duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Retour à la connexion</span>
                </div>
              </button>
            </div>
          )}

          {/* Information supplémentaire - Only show on email step */}
          {currentStep === 'email' && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-900">Besoin d'aide ?</h3>
                </div>
                <p className="text-orange-800 text-sm">
                  Si vous ne recevez pas l'email, vérifiez vos spams ou contactez le support.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}