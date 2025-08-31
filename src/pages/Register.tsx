import { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';

interface RegisterProps {
  onRegister: (username: string, email: string, password: string) => void;
  onBackToLogin: () => void;
  onBackToHome?: () => void;
}

export default function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation username
    if (username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Validation email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation password
    if (password.length < 6) {
      newErrors.password = 'Mot de passe trop court (min 6 caractères)';
    }

    // Confirmation password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onRegister(username, email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-xl border border-gray-200 p-2">
              <img 
                src="https://s6.imgcdn.dev/YQjTwD.png" 
                alt="TagaNum Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-800 bg-clip-text text-transparent font-montserrat">
                Créer un compte
              </h1>
              <p className="text-gray-600 text-lg mt-2 font-montserrat">
                Rejoignez TagaNum
              </p>
            </div>
          </div>

          {/* Formulaire d'inscription */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">Nom d'utilisateur</label>
                </div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Votre nom d'utilisateur"
                  className={`text-lg p-4 rounded-xl border-2 transition-all duration-200 ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100'
                  }`}
                />
                {errors.username && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">Email</label>
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className={`text-lg p-4 rounded-xl border-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">Mot de passe</label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`text-lg p-4 rounded-xl border-2 transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">Confirmer le mot de passe</label>
                </div>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`text-lg p-4 rounded-xl border-2 transition-all duration-200 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading || !username || !email || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
              >
                <div className="flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Inscription en cours...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Créer mon compte</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Lien retour connexion */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={onBackToLogin}
                className="text-green-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Déjà un compte ? Se connecter</span>
                </div>
              </button>
            </div>
          </div>

          {/* Information supplémentaire */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-secondary-900 font-montserrat">Pourquoi s'inscrire ?</h3>
              </div>
              <p className="text-secondary-800 text-sm font-montserrat">
                Accédez à des numéros virtuels pour recevoir des SMS de vérification en toute sécurité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}