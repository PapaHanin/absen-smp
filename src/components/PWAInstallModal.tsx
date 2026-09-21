import React, { useEffect } from 'react';
import { Download, X, Smartphone, Globe, CheckCircle2, ChevronRight, Apple, Chrome, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallDirect?: () => Promise<boolean>;
  isInstallable?: boolean;
  isIOS?: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallDirect,
  isInstallable = false,
  isIOS = false,
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-800/30 dark:border-emerald-700/30 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-emerald-900 text-white border-b border-emerald-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Download className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white leading-tight">Install Aplikasi Presensi</h3>
              <p className="text-xs text-emerald-200">SD INPRES 2 ULATAN (PWA Resmi)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700 dark:text-slate-200 text-sm">
          {/* App Preview Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <img
              src="/pwa-192x192.png"
              alt="Logo SDI 2 Ulatan"
              className="w-14 h-14 rounded-xl shadow-md border border-emerald-600/30 shrink-0 object-contain bg-[#043328] p-1"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">SD INPRES 2 ULATAN</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">Sistem Absensi Digital QR Code Siswa</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Standalone PWA
                </span>
                <span>• Bekerja Offline</span>
              </div>
            </div>
          </div>

          {/* Direct Install Button if browser supports it */}
          {isInstallable && onInstallDirect && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Browser Anda Siap Menginstall</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">1-Klik Cepat</span>
              </div>
              <p className="text-xs text-emerald-100">
                Klik tombol di bawah untuk langsung memasang ikon aplikasi di Layar Utama HP / Desktop tanpa unduh dari PlayStore.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const success = await onInstallDirect();
                  if (success) onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow hover:bg-emerald-50 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                Pasang Aplikasi Sekarang
              </button>
            </div>
          )}

          {/* Instructions Tabs / Sections */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Panduan Pasang Manual di Perangkat:
            </h5>

            {/* iOS Safari Guide */}
            <div className={`p-4 rounded-xl border ${isIOS ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'} space-y-2.5`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Apple className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                <span>Pengguna iPhone &amp; iPad (Safari)</span>
                {isIOS && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold ml-auto">Perangkat Anda</span>}
              </div>
              <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside pl-1">
                <li className="leading-relaxed">
                  Buka website ini menggunakan peramban <strong>Safari</strong> bawaan Apple.
                </li>
                <li className="leading-relaxed">
                  Ketuk tombol <strong>Bagikan / Share</strong> (<Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-600 dark:text-blue-400" />) di baris menu bawah Safari.
                </li>
                <li className="leading-relaxed">
                  Gulir ke bawah dan pilih menu <strong>Tambahkan ke Layar Utama</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-700 dark:text-slate-300" /> <em>Add to Home Screen</em>).
                </li>
                <li className="leading-relaxed">
                  Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon SD INPRES 2 ULATAN akan muncul di layar iPhone Anda!
                </li>
              </ol>
            </div>

            {/* Android Chrome Guide */}
            <div className={`p-4 rounded-xl border ${!isIOS ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'} space-y-2.5`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Chrome className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pengguna HP Android (Chrome / Edge)</span>
              </div>
              <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside pl-1">
                <li className="leading-relaxed">
                  Ketuk ikon <strong>titik tiga (⋮)</strong> di sudut kanan atas peramban Chrome.
                </li>
                <li className="leading-relaxed">
                  Pilih menu <strong>Pasang aplikasi</strong> atau <strong>Tambahkan ke Layar Utama</strong>.
                </li>
                <li className="leading-relaxed">
                  Konfirmasi dengan menekan <strong>Install</strong>. Aplikasi siap digunakan secara instan dan tanpa kuota berat.
                </li>
              </ol>
            </div>

            {/* Laptop / PC Guide */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Pengguna Komputer / Laptop (Windows &amp; Mac)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Di Google Chrome atau Microsoft Edge, klik ikon komputer/pasang kecil (<Download className="w-3.5 h-3.5 inline mx-0.5 text-slate-700 dark:text-slate-300" />) di ujung kanan bilah alamat URL (Address Bar) lalu klik <strong>Install</strong>.
              </p>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">Tampilan Full Screen</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Bebas baris URL browser</p>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 text-center">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
              <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">Bisa Dibuka Offline</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Data tersimpan di cache HP</p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-end gap-2.5 px-5 py-3.5 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
