interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export default function LandingPage({ onGoToLogin, onGoToRegister }: LandingPageProps) {
  const features = [
    {
      icon: "🌍",
      title: "Couverture Mondiale",
      description: "Accès aux numéros de plus de 10 pays africains"
    },
    {
      icon: "⚡",
      title: "Réception Instantanée",
      description: "Recevez vos codes SMS en temps réel"
    },
    {
      icon: "🔒",
      title: "100% Sécurisé",
      description: "Vos données sont protégées et chiffrées"
    },
    {
      icon: "💰",
      title: "Prix Transparents",
      description: "Tarifs compétitifs, paiement sécurisé"
    }
  ];


  const pricingPlans = [
    { amount: "1000", credits: "1000", popular: false },
    { amount: "5000", credits: "5000", popular: true },
    { amount: "10000", credits: "10000", popular: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <img 
                  src="https://s6.imgcdn.dev/YQjTwD.png" 
                  alt="TagaNum Logo" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary font-montserrat">TagaNum</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary font-montserrat font-medium transition-colors">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary font-montserrat font-medium transition-colors">
                Tarifs
              </a>
            </nav>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onGoToLogin}
                className="text-primary hover:text-primary-700 font-montserrat font-medium transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={onGoToRegister}
                className="bg-primary hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-montserrat font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-md mb-8">
              <span className="text-primary font-montserrat font-semibold text-sm">
                🚀 Numéros virtuels temporaires de vérification
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 font-montserrat mb-6 leading-tight">
              Obtenez vos numéros virtuels avec{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                TagaNum
              </span>
            </h1>

            {/* Sub Heading */}
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto mb-10 leading-relaxed">
              La solution la plus fiable pour obtenir des numéros virtuels temporaires de vérification. 
              Simple, anonyme et instantané.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={onGoToRegister}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Commencer gratuitement
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Découvrir les fonctionnalités
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-primary font-montserrat">10+</div>
                <div className="text-gray-600 font-montserrat font-medium">Pays couverts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-primary font-montserrat">99%</div>
                <div className="text-gray-600 font-montserrat font-medium">Taux de réussite</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-primary font-montserrat">24/7</div>
                <div className="text-gray-600 font-montserrat font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 font-montserrat mb-4">
              Pourquoi choisir TagaNum ?
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-2xl mx-auto">
              Une plateforme simple et efficace pour vos besoins de vérification SMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-primary-50 transition-all duration-300 hover:scale-105 border border-gray-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-montserrat">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 font-montserrat mb-4">
              Tarifs transparents
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-2xl mx-auto">
              1 crédit = 1 FCFA. Simple, transparent, sans surprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-primary shadow-primary/20' 
                  : 'border-gray-200 hover:border-primary'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-bold font-montserrat">
                      POPULAIRE
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 font-montserrat mb-2">
                    {plan.amount} FCFA
                  </div>
                  <div className="text-primary font-montserrat font-semibold mb-6">
                    {plan.credits} crédits
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-montserrat text-gray-600">SMS instantanés</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-montserrat text-gray-600">Tous les pays</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-montserrat text-gray-600">Support 24/7</span>
                    </div>
                  </div>

                  <button
                    onClick={onGoToRegister}
                    className={`w-full py-3 rounded-xl font-montserrat font-bold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-primary hover:text-white'
                    }`}
                  >
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white font-montserrat mb-6">
            Prêt à commencer avec TagaNum ?
          </h2>
          <p className="text-xl text-primary-100 font-montserrat mb-10">
            Rejoignez des milliers d'utilisateurs qui font confiance à TagaNum pour leurs codes SMS.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGoToRegister}
              className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Créer mon compte gratuitement
            </button>
            <button
              onClick={onGoToLogin}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              J'ai déjà un compte
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <img 
                  src="https://s6.imgcdn.dev/YQjTwD.png" 
                  alt="TagaNum Logo" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <h3 className="text-2xl font-bold font-montserrat">TagaNum</h3>
            </div>
            
            <p className="text-gray-400 font-montserrat mb-8 max-w-2xl mx-auto">
              La plateforme de référence pour recevoir des codes SMS de vérification sur des numéros virtuels temporaires.
            </p>

            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400 font-montserrat text-sm">
                © 2024 TagaNum. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}