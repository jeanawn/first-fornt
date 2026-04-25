import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const { language } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // iOS detection (no beforeinstallprompt support)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    setIsIos(ios);

    // Dismissed before? don't show again for 7 days
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedAt) {
      const diff = Date.now() - Number(dismissedAt);
      if (diff < 7 * 24 * 60 * 60 * 1000) return;
    }

    if (ios) {
      // Show iOS instructions after 3s
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa_prompt_dismissed', String(Date.now()));
  };

  if (!show || isInstalled) return null;

  const fr = language === 'fr';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center px-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleDismiss}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 mb-4 shadow-2xl">
        {/* App icon + name */}
        <div className="flex items-center gap-4 mb-5">
          <img
            src="https://i.postimg.cc/fRm60V7Z/LOGO-XAARY-500x500.png"
            alt="Xaary"
            className="w-14 h-14 rounded-2xl border border-gray-100 shadow-sm"
          />
          <div>
            <p className="font-bold text-gray-900 text-lg font-montserrat">Xaary</p>
            <p className="text-sm text-gray-500">
              {fr ? 'Numéros virtuels SMS' : 'Virtual SMS numbers'}
            </p>
          </div>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-1 font-montserrat">
          {fr ? 'Installer l\'application' : 'Install the app'}
        </h2>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          {fr
            ? 'Ajoutez Xaary à votre écran d\'accueil pour un accès rapide, même sans connexion.'
            : 'Add Xaary to your home screen for quick access, even offline.'}
        </p>

        {isIos ? (
          /* iOS instructions */
          <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
            <p className="text-sm text-gray-700 font-medium mb-3">
              {fr ? 'Comment installer :' : 'How to install:'}
            </p>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">1.</span>
                <span>
                  {fr ? 'Appuyez sur' : 'Tap'}{' '}
                  <strong>{fr ? 'Partager' : 'Share'}</strong>{' '}
                  <svg className="inline w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l-4 4h3v8h2V6h3l-4-4zm-7 14v4h14v-4h-2v2H7v-2H5z"/>
                  </svg>
                  {fr ? ' en bas de Safari' : ' at the bottom of Safari'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">2.</span>
                <span>
                  {fr ? 'Sélectionnez' : 'Select'}{' '}
                  <strong>{fr ? '"Sur l\'écran d\'accueil"' : '"Add to Home Screen"'}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">3.</span>
                <span>{fr ? 'Appuyez sur' : 'Tap'} <strong>{fr ? '"Ajouter"' : '"Add"'}</strong></span>
              </li>
            </ol>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors min-h-[44px]"
          >
            {fr ? 'Plus tard' : 'Later'}
          </button>
          {!isIos && (
            <button
              onClick={handleInstall}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold transition-colors min-h-[44px] font-montserrat"
            >
              {fr ? 'Installer' : 'Install'}
            </button>
          )}
          {isIos && (
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold transition-colors min-h-[44px] font-montserrat"
            >
              {fr ? 'Compris !' : 'Got it!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
