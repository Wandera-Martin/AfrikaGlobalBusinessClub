import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Listen for global custom events triggered outside of React (e.g., fetch interceptors)
  useEffect(() => {
    const handleAuthForbidden = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      showToast(customEvent.detail.message || "You don't have permission to do this.", 'error');
    };

    window.addEventListener('auth-forbidden', handleAuthForbidden);
    return () => window.removeEventListener('auth-forbidden', handleAuthForbidden);
  }, [showToast]);

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const colors: Record<ToastType, string> = {
    success: '#22c55e',
    error: '#ef4444',
    info: '#3b82f6',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '12px',
              background: '#1e293b',
              color: '#f1f5f9',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              minWidth: '260px',
              maxWidth: '360px',
              animation: 'slideInToast 0.3s ease',
              pointerEvents: 'all',
              borderLeft: `4px solid ${colors[toast.type]}`,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: colors[toast.type],
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {icons[toast.type]}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
