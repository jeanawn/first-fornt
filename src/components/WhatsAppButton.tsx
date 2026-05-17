import { useEffect, useState } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  liftAboveBottomNav?: boolean;
}

const DEFAULT_PHONE = '22890922233';
const DEFAULT_MESSAGE = "Bonjour Xaary, j'ai besoin d'aide.";

export default function WhatsAppButton({
  phoneNumber = DEFAULT_PHONE,
  message = DEFAULT_MESSAGE,
  liftAboveBottomNav = false,
}: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 7000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const bottomOffset = liftAboveBottomNav
    ? 'calc(5rem + env(safe-area-inset-bottom))'
    : 'calc(1.25rem + env(safe-area-inset-bottom))';

  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-end gap-2"
      style={{ bottom: bottomOffset }}
    >
      {showTooltip && (
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-2.5 max-w-[220px] animate-fade-in cursor-pointer"
          onClick={() => setShowTooltip(false)}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-800 font-medium leading-snug">
              Besoin d'aide ? Discutons sur WhatsApp 👋
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-400 hover:text-gray-600 -mt-0.5 -mr-1"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter le support sur WhatsApp"
        onClick={() => setShowTooltip(false)}
        className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center group"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 text-white relative z-10"
          fill="currentColor"
        >
          <path d="M16.003 3C9.373 3 4 8.373 4 15.003c0 2.65.86 5.106 2.32 7.106L4 29l7.07-2.28A11.94 11.94 0 0016.003 27C22.633 27 28 21.633 28 15.003 28 8.373 22.633 3 16.003 3zm0 21.6a9.6 9.6 0 01-4.9-1.34l-.35-.21-4.2 1.35 1.37-4.09-.23-.36a9.6 9.6 0 1117.92-5.95c0 5.3-4.31 9.6-9.61 9.6zm5.27-7.18c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.66.14-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.43-1.71-1.6-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.36-.02-.5-.07-.14-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5l-.56-.01c-.2 0-.5.07-.77.36-.27.29-1.02 1-1.02 2.43s1.05 2.82 1.19 3.02c.14.2 2.06 3.14 5 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.12.56-.08 1.71-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
        </svg>
      </a>
    </div>
  );
}
