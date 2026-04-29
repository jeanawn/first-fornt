import { useTranslation } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToPrivacyPolicy?: () => void;
  onGoToTermsOfService?: () => void;
}

export default function LandingPage({ onGoToLogin, onGoToRegister, onGoToPrivacyPolicy, onGoToTermsOfService }: LandingPageProps) {
  const { t } = useTranslation();
  usePageTitle(PAGE_TITLES.landing);

  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t.landing.features.coverage.title,
      description: t.landing.features.coverage.description,
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t.landing.features.instant.title,
      description: t.landing.features.instant.description,
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t.landing.features.secure.title,
      description: t.landing.features.secure.description,
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
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
      <section className="relative overflow-hidden bg-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-md mb-8">
              <span className="text-primary font-montserrat font-semibold text-sm">
                {t.landing.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 font-montserrat mb-6 leading-tight">
              {t.landing.hero.title}{' '}
              <span className="text-primary">
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
                className="w-full sm:w-auto bg-primary hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
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
                <div className="flex justify-center mb-4">{feature.icon}</div>
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


      {/* Referral Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 rounded-full px-5 py-2 mb-6 font-montserrat font-semibold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Programme de parrainage
            </div>
            <h2 className="text-4xl font-black text-white font-montserrat mb-4">
              {t.landing.referral.title}
            </h2>
            <p className="text-lg text-gray-400 font-montserrat max-w-2xl mx-auto">
              {t.landing.referral.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-12">
            {/* Step 1 */}
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <p className="font-bold text-white font-montserrat mb-1">{t.landing.referral.step1Label}</p>
              <p className="text-gray-400 text-sm font-montserrat">{t.landing.referral.step1Desc}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="font-bold text-white font-montserrat mb-1">{t.landing.referral.step2Label}</p>
              <p className="text-gray-400 text-sm font-montserrat">{t.landing.referral.step2Desc}</p>
            </div>

            {/* Step 3 with reward */}
            <div className="bg-yellow-400 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-500 opacity-50"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-bold text-gray-900 font-montserrat mb-1">{t.landing.referral.rewardLabel}</p>
                <p className="text-3xl font-black text-gray-900 font-montserrat">{t.landing.referral.rewardAmount}</p>
                <p className="text-gray-800 text-xs font-montserrat mt-1">{t.landing.referral.step3Desc}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={onGoToRegister}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-10 py-4 rounded-2xl font-montserrat text-lg transition-all duration-300 hover:scale-105 shadow-xl"
            >
              {t.landing.referral.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 font-montserrat mb-3">
              {t.landing.reviews.title}
            </h2>
            <p className="text-lg text-gray-500 font-montserrat">
              {t.landing.reviews.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[t.landing.reviews.review1, t.landing.reviews.review2, t.landing.reviews.review3].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 font-montserrat text-sm leading-relaxed flex-1">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-montserrat font-semibold text-gray-900 text-sm">{review.name}</span>
                  <span className="bg-primary-50 text-primary font-montserrat font-semibold text-xs px-3 py-1 rounded-full">
                    {review.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
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
            <div className="bg-primary-700 p-8 text-center">
              <p className="text-primary-100 font-montserrat text-lg mb-2">
                {t.landing.pricing.startingFrom}
              </p>
              <div className="flex items-center justify-center">
                <span className="text-5xl font-black text-white font-montserrat">1 000</span>
                <span className="text-3xl font-bold text-white font-montserrat ml-2">FCFA</span>
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
                className="w-full bg-primary hover:bg-primary-700 text-white py-4 rounded-2xl font-montserrat font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {t.landing.pricing.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700">
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
