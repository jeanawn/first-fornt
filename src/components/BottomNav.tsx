import { useTranslation } from '../i18n';

type Page = 'dashboard' | 'buy-number' | 'recharge' | string;

interface BottomNavProps {
  currentPage: Page;
  onGoToDashboard: () => void;
  onGoToBuyNumber: () => void;
  onGoToRecharge: () => void;
}

interface TabItem {
  key: string;
  labelFr: string;
  labelEn: string;
  onClick: () => void;
  icon: (active: boolean) => JSX.Element;
}

export default function BottomNav({
  currentPage,
  onGoToDashboard,
  onGoToBuyNumber,
  onGoToRecharge,
}: BottomNavProps) {
  const { language } = useTranslation();

  const tabs: TabItem[] = [
    {
      key: 'dashboard',
      labelFr: 'Accueil',
      labelEn: 'Home',
      onClick: onGoToDashboard,
      icon: (active) => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: 'buy-number',
      labelFr: 'Numéro',
      labelEn: 'Number',
      onClick: onGoToBuyNumber,
      icon: (active) => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      key: 'recharge',
      labelFr: 'Recharger',
      labelEn: 'Top up',
      onClick: onGoToRecharge,
      icon: (active) => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d={active
            ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            : "M12 6v6m0 0v6m0-6h6m-6 0H6"
          } />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const active = currentPage === tab.key;
          return (
            <button
              key={tab.key}
              onClick={tab.onClick}
              className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1 gap-0.5 min-h-[56px] transition-colors ${
                active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Active indicator */}
              <span className={`block h-0.5 w-5 rounded-full mb-1 transition-all ${active ? 'bg-primary' : 'bg-transparent'}`} />
              {tab.icon(active)}
              <span className="text-[11px] font-semibold tracking-wide mt-0.5">
                {language === 'fr' ? tab.labelFr : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
