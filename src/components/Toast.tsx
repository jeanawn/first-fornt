import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const toastStyles: Record<ToastType, { bg: string; icon: string; iconBg: string; border: string }> = {
  success: {
    bg: 'bg-green-50',
    icon: '✓',
    iconBg: 'bg-green-500',
    border: 'border-green-200'
  },
  error: {
    bg: 'bg-red-50',
    icon: '✕',
    iconBg: 'bg-red-500',
    border: 'border-red-200'
  },
  warning: {
    bg: 'bg-amber-50',
    icon: '⚠',
    iconBg: 'bg-amber-500',
    border: 'border-amber-200'
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'ℹ',
    iconBg: 'bg-blue-500',
    border: 'border-blue-200'
  }
};

function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const style = toastStyles[toast.type];

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 10);

    // Auto-fermeture
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`${style.bg} ${style.border} border rounded-2xl p-4 shadow-lg max-w-sm backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className={`${style.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-sm font-bold">{style.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{toast.title}</p>
            <p className="text-gray-600 text-sm mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => {
              setIsLeaving(true);
              setTimeout(() => onClose(toast.id), 300);
            }}
            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, message: string, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    addToast('success', title, message, duration);
  };

  const showError = (title: string, message: string, duration?: number) => {
    addToast('error', title, message, duration || 6000);
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addToast('warning', title, message, duration);
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addToast('info', title, message, duration);
  };

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

export default ToastContainer;
