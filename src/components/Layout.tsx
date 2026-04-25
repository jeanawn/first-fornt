import type { ReactNode } from 'react';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showLanguageSwitcher?: boolean;
  showBottomNav?: boolean;
}

export default function Layout({
  children,
  showHeader = true,
  showLanguageSwitcher = true,
  showBottomNav = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && (
        <header
          className="bg-white border-b border-gray-200 sticky top-0 z-40"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-white rounded-lg border border-gray-100 shadow-sm p-1 flex-shrink-0">
                <img
                  src="https://i.postimg.cc/fRm60V7Z/LOGO-XAARY-500x500.png"
                  alt="Xaary"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <span className="text-lg font-bold text-gray-900 font-montserrat">Xaary</span>
            </div>

            {showLanguageSwitcher && (
              <LanguageSwitcher variant="minimal" />
            )}
          </div>
        </header>
      )}

      <main
        className="flex-1 max-w-md mx-auto w-full px-4 py-6"
        style={{ paddingBottom: showBottomNav ? 'calc(5rem + env(safe-area-inset-bottom))' : undefined }}
      >
        {children}
      </main>
    </div>
  );
}
