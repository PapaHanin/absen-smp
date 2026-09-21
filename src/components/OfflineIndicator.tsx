import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestoredNotice) {
    return null;
  }

  if (showRestoredNotice) {
    return (
      <aside
        aria-label="Status Jaringan"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-xl border border-emerald-400/40 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none"
      >
        <Wifi className="w-4 h-4 text-emerald-100 animate-pulse" />
        <span>Koneksi Internet Pulih — Sinkronisasi siap dilanjutkan</span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Peringatan Koneksi Offline"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-600 dark:bg-amber-700 text-white text-xs font-medium shadow-2xl border border-amber-400/50 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[90vw]"
    >
      <div className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-100 shrink-0" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="font-bold">Mode Offline Aktif</span>
        <span className="text-amber-100 text-[11px] sm:text-xs">
          Aplikasi tetap dapat digunakan untuk scan absensi dan tersimpan di memori lokal.
        </span>
      </div>
    </aside>
  );
};
