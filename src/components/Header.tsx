import React, { useState, useEffect } from 'react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleMobileSidebar?: () => void;
  currentSchoolName?: string;
  onOpenLessonSchedule?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode = false,
  onToggleDarkMode,
  onToggleMobileSidebar,
  currentSchoolName = 'SMP NEGERI SATAP 4 PALASA',
  onOpenLessonSchedule,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="bg-[#0f2347]/95 dark:bg-[#09152e]/95 backdrop-blur-md border-b border-[#1e3a8a] dark:border-[#162a52] sticky top-0 z-20 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Sidebar Toggle + Live Date & Time */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Toggle (hidden on desktop) */}
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-blue-200 bg-[#162f5c] dark:bg-[#0e1d3b] hover:bg-[#1e3e78] dark:hover:bg-[#162a52] border border-[#234b91] transition-colors cursor-pointer shrink-0"
              title="Buka Navigasi Menu"
              aria-label="Toggle navigation"
            >
              <i className="fa-solid fa-bars text-sm"></i>
            </button>
          )}

          {/* Date & Time Display */}
          <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-xl bg-[#162f5c] dark:bg-[#0e1d3b] border border-[#234b91] dark:border-[#162a52] text-xs sm:text-sm text-blue-100 font-medium shadow-2xs shrink-0">
            <i className="fa-regular fa-calendar-days text-blue-300 text-xs"></i>
            <span className="font-semibold text-white hidden sm:inline">{formattedDate}</span>
            <span className="text-blue-300/40 hidden sm:inline">•</span>
            <span className="font-mono font-bold text-blue-200">
              {formattedTime} <span className="text-[10px] font-normal text-blue-300/70">WIB</span>
            </span>
          </div>
        </div>

        {/* Right: PWA Install + Jadwal Jam Mapel + Active School Pill + Dark/Light Toggle */}
        <div className="flex items-center gap-2">
          {onOpenLessonSchedule && (
            <button
              type="button"
              onClick={onOpenLessonSchedule}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer border border-blue-400/40 shrink-0"
              title="Lihat Struktur Jam & Jadwal Pelajaran SMP"
            >
              <i className="fa-solid fa-clock text-amber-300 text-xs"></i>
              <span className="hidden sm:inline">Jadwal Jam Mapel</span>
            </button>
          )}

          <PWAInstallButton variant="header" />

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#162f5c] dark:bg-[#0e1d3b] border border-[#234b91] dark:border-[#162a52] text-xs text-blue-100 shadow-2xs max-w-[180px] sm:max-w-[300px]"
            title={`Sekolah: ${currentSchoolName}`}
          >
            <i className="fa-solid fa-school text-blue-300 text-xs shrink-0"></i>
            <span className="font-bold text-white truncate text-[11px] sm:text-xs">
              {currentSchoolName}
            </span>
          </div>

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm font-bold text-amber-300 bg-[#162f5c] hover:bg-[#1e3e78] dark:bg-[#0e1d3b] dark:hover:bg-[#162a52] border border-[#234b91] dark:border-[#162a52] transition-all cursor-pointer shadow-2xs shrink-0"
              title={isDarkMode ? 'Ganti ke Mode Terang (Biru Putih SMP)' : 'Ganti ke Mode Gelap (Midnight Navy SMP)'}
              aria-label="Toggle Dark Mode"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400 text-base' : 'fa-moon text-blue-200 text-base'}`}></i>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
