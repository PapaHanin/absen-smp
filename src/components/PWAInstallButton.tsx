import React, { useState } from 'react';
import { Download, Smartphone, Check, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'card' | 'compact';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running as installed standalone app, suppress from header/sidebar or show active badge
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className={`p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Aplikasi Telah Terpasang (PWA)</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Aplikasi SD INPRES 2 ULATAN berjalan sebagai aplikasi native standalone.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
            Aktif
          </span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        // If dismissed or on error, open guide modal
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleClick}
          title="Install Aplikasi SD INPRES 2 ULATAN ke HP / Komputer"
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all duration-200 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-100 border border-emerald-500/40 hover:border-emerald-400 active:scale-95 ${className}`}
        >
          <div className="relative">
            <Download className="w-3.5 h-3.5 text-emerald-300 group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <span className="hidden sm:inline">Install Aplikasi</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 bg-gradient-to-r from-emerald-800/60 to-teal-800/60 hover:from-emerald-700/70 hover:to-teal-700/70 text-emerald-100 border border-emerald-600/40 shadow-xs group ${className}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 border border-emerald-400/30 group-hover:scale-105 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left truncate">
              <p className="font-bold text-white leading-none">Install Aplikasi</p>
              <p className="text-[10px] text-emerald-200/80 mt-0.5">Layar Utama HP / PC</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-200 font-medium">
            PWA
          </span>
        </button>
      )}

      {variant === 'card' && (
        <div className={`p-4 rounded-xl bg-gradient-to-br from-emerald-900/90 to-teal-950 text-white border border-emerald-600/50 shadow-md ${className}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Pasang Aplikasi Presensi (PWA)</h4>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Buka aplikasi seperti aplikasi Android/iOS resmi, lebih cepat dan bisa dibuka saat tanpa internet.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="flex-1 min-w-[160px] py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow hover:shadow-emerald-500/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-950" />
              {isInstallable ? 'Install ke Perangkat Sekarang' : 'Panduan Pasang di HP'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
              Petunjuk
            </button>
          </div>
        </div>
      )}

      {variant === 'compact' && (
        <button
          type="button"
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 transition ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Pasang App</span>
        </button>
      )}

      {/* Installation Guide Modal */}
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInstallDirect={isInstallable ? install : undefined}
        isInstallable={isInstallable}
        isIOS={isIOS}
      />
    </>
  );
};
