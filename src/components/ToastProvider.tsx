'use client';
import { createContext, useContext, useState } from 'react';

export type ToastType = 'success' | 'error';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            role="status"
            className={`px-4 py-2 rounded shadow text-white ${
              t.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
