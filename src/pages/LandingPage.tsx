import { useTranslation } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToPrivacyPolicy?: () => void;
  onGoToTermsOfService?: () => void;
}

export default function LandingPage({ onGoToLogin, onGoToRegister, onGoToPrivacyPolicy, onGoToTermsOfService }: LandingPageProps) {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🌍",
      title: t.landing.features.coverage.title,
      description: t.landing.features.coverage.description,
    },
    {
      icon: "⚡",
      title: t.landing.features.instant.title,
      description: t.landing.features.instant.description,
    },
    {
      icon: "🔒",
      title: t.landing.features.secure.title,
      description: t.landing.features.secure.description,
    },
    {
      icon: "💰",
      title: t.landing.features.pricing.title,
      description: t.landing.features.pricing.description,
    }
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
                  src="https://i.postimg.cc/fRm60V7Z/LOGO-XAARY-500x500.png"
                  alt="Xaary Logo"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary font-montserrat">Xaary</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary font-montserrat font-medium transition-colors">
                {t.landing.nav.features}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary font-montserrat font-medium transition-colors">
                {t.landing.nav.pricing}
              </a>
            </nav>

            {/* Buttons + Language Switcher */}
            <div className="flex items-center space-x-3">
              <LanguageSwitcher variant="pill" showLabel={false} />
              <button
                onClick={onGoToLogin}
                className="text-primary hover:text-primary-700 font-montserrat font-medium transition-colors hidden sm:block"
              >
                {t.landing.nav.login}
              </button>
              <button
                onClick={onGoToRegister}
                className="bg-primary hover:bg-primary-700 text-white px-4 sm:px-6 py-2 rounded-xl font-montserrat font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                {t.landing.nav.register}
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
                🚀 {t.landing.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 font-montserrat mb-6 leading-tight">
              {t.landing.hero.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Xaary
              </span>
            </h1>

            {/* Sub Heading */}
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto mb-10 leading-relaxed">
              {t.landing.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={onGoToRegister}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
              >
                {t.landing.hero.cta}
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {t.landing.hero.discover}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-primary font-montserrat">10+</div>
                <div className="text-gray-600 font-montserrat font-medium">{t.landing.stats.countries}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-primary font-montserrat">99%</div>
                <div className="text-gray-600 font-montserrat font-medium">{t.landing.stats.successRate}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-primary font-montserrat">24/7</div>
                <div className="text-gray-600 font-montserrat font-medium">{t.landing.stats.support}</div>
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
              {t.landing.features.title}
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-2xl mx-auto">
              {t.landing.features.subtitle}
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
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 font-montserrat mb-4">
              {t.landing.pricing.title}
            </h2>
            <p className="text-xl text-gray-600 font-montserrat">
              {t.landing.pricing.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
              <p className="text-primary-100 font-montserrat text-lg mb-2">
                {t.landing.pricing.startingFrom}
              </p>
              <div className="flex items-center justify-center">
                <span className="text-7xl font-black text-white font-montserrat">2</span>
                <span className="text-4xl font-bold text-white font-montserrat ml-2">$</span>
              </div>
              <p className="text-primary-100 font-montserrat text-lg mt-2">
                {t.landing.pricing.perNumber}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="font-montserrat text-gray-700 font-medium text-sm">{t.landing.pricing.features.instantSms}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-montserrat text-gray-700 font-medium text-sm">{t.landing.pricing.features.allCountries}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="font-montserrat text-gray-700 font-medium text-sm">{t.landing.pricing.features.support247}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-montserrat text-gray-700 font-medium text-sm">{t.landing.pricing.features.noSubscription}</p>
                </div>
              </div>

              <button
                onClick={onGoToRegister}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {t.landing.pricing.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white font-montserrat mb-6">
            {t.landing.cta.title}
          </h2>
          <p className="text-xl text-primary-100 font-montserrat mb-10">
            {t.landing.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGoToRegister}
              className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
            >
              {t.landing.cta.createAccount}
            </button>
            <button
              onClick={onGoToLogin}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              {t.landing.cta.haveAccount}
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
                  src="https://i.postimg.cc/fRm60V7Z/LOGO-XAARY-500x500.png"
                  alt="Xaary Logo"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <h3 className="text-2xl font-bold font-montserrat">Xaary</h3>
            </div>

            <p className="text-gray-400 font-montserrat mb-8 max-w-2xl mx-auto">
              {t.landing.footer.description}
            </p>

            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 font-montserrat text-sm">
                  {t.landing.footer.copyright}
                </p>

                <div className="flex items-center space-x-6">
                  <button
                    onClick={onGoToPrivacyPolicy}
                    className="text-gray-400 hover:text-white font-montserrat text-sm transition-colors"
                  >
                    {t.landing.footer.privacy}
                  </button>
                  <button
                    onClick={onGoToTermsOfService}
                    className="text-gray-400 hover:text-white font-montserrat text-sm transition-colors"
                  >
                    {t.landing.footer.terms}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
