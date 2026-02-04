import { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import { useTranslation } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

interface LoginProps {
  onLogin: (emailOrUsername: string, password: string) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onBackToHome?: () => void;
}

export default function Login({ onLogin, onForgotPassword, onRegister, onBackToHome }: LoginProps) {
  const { t } = useTranslation();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onLogin(emailOrUsername, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Top bar with back + language */}
          <div className="flex items-center justify-between">
            {onBackToHome ? (
              <button
                onClick={onBackToHome}
                className="text-primary hover:text-primary-700 font-montserrat font-medium transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{t.auth.login.backToHome}</span>
              </button>
            ) : <div />}
            <LanguageSwitcher variant="pill" showLabel={false} />
          </div>

          {/* Logo et titre */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-xl border border-gray-200 p-2">
              <img
                src="https://i.postimg.cc/fRm60V7Z/LOGO-XAARY-500x500.png"
                alt="Xaary Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-800 bg-clip-text text-transparent font-montserrat">
                Xaary
              </h1>
              <p className="text-gray-600 text-lg mt-2 font-montserrat">
                {t.auth.login.subtitle}
              </p>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">{t.auth.login.emailOrUsername}</label>
                </div>
                <Input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">{t.auth.login.password}</label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !emailOrUsername || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
              >
                <div className="flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>{t.auth.login.submit}</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Liens navigation */}
            <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
              {/* Mot de passe oublié */}
              <div className="text-center">
                <button
                  onClick={onForgotPassword}
                  className="text-blue-600 hover:text-purple-600 text-sm font-medium transition-colors duration-200"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t.auth.login.forgotPassword}</span>
                  </div>
                </button>
              </div>

              {/* Inscription */}
              <div className="text-center">
                <button
                  onClick={onRegister}
                  className="text-green-600 hover:text-emerald-600 text-sm font-bold transition-colors duration-200 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>{t.auth.login.noAccount} {t.auth.login.register}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
