import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <img
                  src="https://i.postimg.cc/fRm60V7Z/LOGO-XAARY-500x500.png"
                  alt="Xaary Logo"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 font-montserrat">
                Xaary
              </h1>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}