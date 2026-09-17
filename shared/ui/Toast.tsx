'use client';

import { useToastStore } from './toast-store';

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`rounded-md px-4 py-3 text-sm text-white shadow-md ${
            toast.tone === 'error' ? 'bg-[#C6462F]' : 'bg-[#171512]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-white/70 hover:text-white"
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}