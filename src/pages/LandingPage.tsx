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

  const platforms = [
    {
      name: 'TikTok',
      bg: 'bg-black',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.957-1.166-1.928-1.282-2.608h.004C16.367 1.16 16.405.732 16.41.5h-3.591v13.948a3.027 3.027 0 0 1-3.04 2.95 3.025 3.025 0 0 1-3.025-3.04 3.025 3.025 0 0 1 4.058-2.846V7.825a6.59 6.59 0 0 0-.99-.073 6.616 6.616 0 0 0-6.616 6.617 6.616 6.616 0 0 0 6.616 6.616 6.616 6.616 0 0 0 6.617-6.616V8.137a9.745 9.745 0 0 0 5.69 1.821V6.367a5.71 5.71 0 0 1-2.808-.805Z" />
        </svg>
      ),
      useCase: t.landing.platforms.items.tiktok,
    },
    {
      name: 'YouTube',
      bg: 'bg-red-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      useCase: t.landing.platforms.items.youtube,
    },
    {
      name: 'Instagram',
      bg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
      useCase: t.landing.platforms.items.instagram,
    },
    {
      name: 'Facebook',
      bg: 'bg-blue-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      useCase: t.landing.platforms.items.facebook,
    },
    {
      name: 'WhatsApp',
      bg: 'bg-green-500',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26L.057 24l5.597-3.807zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      useCase: t.landing.platforms.items.whatsapp,
    },
    {
      name: 'Telegram',
      bg: 'bg-sky-500',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      useCase: t.landing.platforms.items.telegram,
    },
    {
      name: 'Google',
      bg: 'bg-white border border-gray-200',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      ),
      useCase: t.landing.platforms.items.google,
    },
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
              <a href="#offers" className="text-gray-600 hover:text-primary font-montserrat font-medium transition-colors">
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
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-md mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary font-montserrat font-semibold text-sm">
                {t.landing.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-montserrat mb-6 leading-[1.1]">
              {t.landing.hero.titleLine1}
              <br />
              <span className="text-primary">{t.landing.hero.titleLine2}</span>
            </h1>

            {/* Sub Heading */}
            <p className="text-lg md:text-xl text-gray-600 font-montserrat max-w-3xl mx-auto mb-10 leading-relaxed">
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
                onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
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

      </section>

      {/* Platforms Slider Section */}
      <section className="py-14 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-montserrat mb-3">
              {t.landing.platforms.title}
            </h2>
            <p className="text-gray-500 font-montserrat">
              {t.landing.platforms.subtitle}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="marquee-track flex gap-4 px-4">
            {[...platforms, ...platforms].map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.bg}`}>
                  {p.icon}
                </div>
                <div className="pr-2">
                  <p className="font-montserrat font-bold text-gray-900 text-sm leading-tight">{p.name}</p>
                  <p className="font-montserrat text-gray-500 text-xs leading-tight mt-0.5">{p.useCase}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent"></div>
        </div>
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
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-primary font-montserrat font-semibold text-sm mb-3">Parrainage</p>
            <h2 className="text-3xl font-black text-gray-900 font-montserrat mb-4">
              {t.landing.referral.title}
            </h2>
            <p className="text-gray-500 font-montserrat max-w-xl">
              {t.landing.referral.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-primary text-primary font-montserrat font-bold text-sm flex items-center justify-center">1</span>
              <div>
                <p className="font-semibold text-gray-900 font-montserrat">{t.landing.referral.step1Label}</p>
                <p className="text-gray-500 font-montserrat text-sm mt-0.5">{t.landing.referral.step1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-primary text-primary font-montserrat font-bold text-sm flex items-center justify-center">2</span>
              <div>
                <p className="font-semibold text-gray-900 font-montserrat">{t.landing.referral.step2Label}</p>
                <p className="text-gray-500 font-montserrat text-sm mt-0.5">{t.landing.referral.step2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-montserrat font-bold text-sm flex items-center justify-center">3</span>
              <div>
                <p className="font-semibold text-gray-900 font-montserrat">{t.landing.referral.rewardLabel} — <span className="text-primary">{t.landing.referral.rewardAmount}</span></p>
                <p className="text-gray-500 font-montserrat text-sm mt-0.5">{t.landing.referral.step3Desc}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onGoToRegister}
            className="bg-primary hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-montserrat font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg"
          >
            {t.landing.referral.cta}
          </button>
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

      {/* Offers Section */}
      <section id="offers" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 font-montserrat mb-4">
              {t.landing.offers.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-montserrat max-w-2xl mx-auto">
              {t.landing.offers.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* SMS Number — basic offer */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-montserrat">
                  {t.landing.offers.sms.label}
                </h3>
              </div>
              <p className="text-gray-500 font-montserrat text-sm mb-6">
                {t.landing.offers.sms.tagline}
              </p>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-400 font-montserrat font-semibold mb-2">
                  {t.landing.offers.sms.priceFrom}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900 font-montserrat">{t.landing.offers.sms.priceValue}</span>
                  <span className="text-xl font-bold text-gray-700 font-montserrat">{t.landing.offers.sms.priceCurrency}</span>
                </div>
                <p className="text-sm text-gray-500 font-montserrat mt-1">{t.landing.offers.sms.priceNote}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[t.landing.offers.sms.feature1, t.landing.offers.sms.feature2, t.landing.offers.sms.feature3, t.landing.offers.sms.feature4].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-montserrat text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onGoToRegister}
                className="w-full bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white py-3.5 rounded-2xl font-montserrat font-bold transition-all duration-200"
              >
                {t.landing.offers.sms.cta}
              </button>
            </div>

            {/* WhatsApp durable — featured offer */}
            <div className="relative bg-gradient-to-br from-primary to-primary-700 rounded-3xl p-8 flex flex-col text-white shadow-2xl md:-mt-4 md:mb-4">
              <div className="absolute -top-3 left-8 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wide shadow-md">
                {t.landing.offers.whatsapp.badge}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26L.057 24l5.597-3.807zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-montserrat">
                  {t.landing.offers.whatsapp.label}
                </h3>
              </div>
              <p className="text-primary-100 font-montserrat text-sm mb-6">
                {t.landing.offers.whatsapp.tagline}
              </p>

              <div className="mb-6 pb-6 border-b border-white/15">
                <p className="text-xs uppercase tracking-wide text-primary-200 font-montserrat font-semibold mb-2">
                  {t.landing.offers.whatsapp.priceFrom}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-black font-montserrat">{t.landing.offers.whatsapp.priceValue}</span>
                  {t.landing.offers.whatsapp.priceCurrency && (
                    <span className="text-xl font-bold font-montserrat">{t.landing.offers.whatsapp.priceCurrency}</span>
                  )}
                </div>
                <p className="text-sm text-primary-100 font-montserrat mt-1">{t.landing.offers.whatsapp.priceNote}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[t.landing.offers.whatsapp.feature1, t.landing.offers.whatsapp.feature2, t.landing.offers.whatsapp.feature3, t.landing.offers.whatsapp.feature4].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-montserrat text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onGoToRegister}
                className="w-full bg-white text-primary hover:bg-gray-50 py-3.5 rounded-2xl font-montserrat font-bold transition-all duration-200 shadow-lg"
              >
                {t.landing.offers.whatsapp.cta}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 font-montserrat mt-10 flex items-center justify-center gap-2 flex-wrap">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t.landing.offers.paymentNote}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 font-montserrat mb-4">
              {t.landing.faq.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-500 font-montserrat">
              {t.landing.faq.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {[t.landing.faq.q1, t.landing.faq.q2, t.landing.faq.q3, t.landing.faq.q4, t.landing.faq.q5, t.landing.faq.q6].map((item, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-primary-200 transition-colors overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none select-none">
                  <span className="font-montserrat font-semibold text-gray-900 text-base">
                    {item.question}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
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
