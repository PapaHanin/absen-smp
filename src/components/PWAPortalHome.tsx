import React from 'react';
import { SystemSettings, Teacher, Student, AttendanceRecord } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface PWAPortalHomeProps {
  settings: SystemSettings;
  currentTeacher: Teacher | null;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onStartScan: () => void;
  onOpenDashboard: () => void;
  onOpenStudents: () => void;
  onOpenLogin: () => void;
  onOpenLessonSchedule?: () => void;
}

export const PWAPortalHome: React.FC<PWAPortalHomeProps> = ({
  settings,
  currentTeacher,
  students,
  attendanceRecords,
  onStartScan,
  onOpenDashboard,
  onOpenStudents,
  onOpenLogin,
  onOpenLessonSchedule,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter((r) => r.date === todayStr);
  const presentCount = todayRecords.filter((r) => r.status === 'Hadir' || r.status === 'Terlambat').length;
  const totalStudents = students.length || 1;
  const attendanceRate = Math.min(100, Math.round((presentCount / totalStudents) * 100));

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col items-center justify-between rounded-3xl overflow-hidden shadow-2xl border border-blue-900/50 bg-gradient-to-b from-[#09152e] via-[#0d1e44] to-[#122b5e] text-white p-4 sm:p-8 select-none transition-all">
      {/* Background Cybernetic Circuit Patterns & Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.4" />
              <circle cx="40" cy="0" r="1.5" fill="#60a5fa" fillOpacity="0.6" />
            </pattern>
            <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#cyber-grid)" />
        </svg>
        {/* Soft Radial Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl"></div>
      </div>

      {/* Top Mobile Status Header Simulation */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between text-xs text-blue-200/80 pb-3 border-b border-blue-800/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span className="font-mono font-semibold tracking-wider text-blue-100">
            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-900/80 border border-blue-500/30 text-blue-300">
            Online Cloud
          </span>
          <i className="fa-solid fa-wifi text-xs text-blue-400"></i>
          <i className="fa-solid fa-battery-three-quarters text-xs text-blue-300"></i>
        </div>
      </div>

      {/* Main Hero Content (Inspired by the Reference Mobile Screenshot) */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center my-auto py-4 space-y-4">
        {/* 1. Cybernetic Education Emblem (Pentagon Shield with Flame & Book) */}
        <div className="relative group cursor-pointer transition-transform hover:scale-105 duration-300">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-[#142d63] to-[#0c1a3b] border-2 border-cyan-400/60 shadow-xl flex items-center justify-center p-2.5">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
              {/* Outer Circuit Pentagon */}
              <polygon
                points="50,6 92,30 76,88 24,88 8,30"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <polygon
                points="50,12 86,33 72,82 28,82 14,33"
                fill="#0d214a"
                stroke="#60a5fa"
                strokeWidth="1.5"
              />
              {/* Circuit Micro-traces */}
              <line x1="14" y1="33" x2="30" y2="33" stroke="#38bdf8" strokeWidth="1" />
              <line x1="86" y1="33" x2="70" y2="33" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="30" cy="33" r="1.5" fill="#38bdf8" />
              <circle cx="70" cy="33" r="1.5" fill="#38bdf8" />
              {/* Flaming Torch of Knowledge (Obor Pendidikan) */}
              <path
                d="M50,18 Q55,26 50,33 Q45,26 50,18 Z"
                fill="url(#torch-flame)"
                className="animate-pulse"
              />
              <path
                d="M48,22 Q52,28 49,34 Q46,28 48,22 Z"
                fill="#fbbf24"
              />
              <rect x="47" y="34" width="6" height="8" rx="1" fill="#94a3b8" />
              <path d="M44,42 L56,42 L52,48 L48,48 Z" fill="#64748b" />
              {/* Open Digital Book (Buku Terbuka Sirkuit) */}
              <path
                d="M50,56 C44,52 35,52 26,55 L26,73 C35,70 44,70 50,74 C56,70 65,70 74,73 L74,55 C65,52 56,52 50,56 Z"
                fill="#1e3a8a"
                stroke="#93c5fd"
                strokeWidth="1.5"
              />
              <line x1="50" y1="56" x2="50" y2="74" stroke="#bfdbfe" strokeWidth="1.5" />
              {/* Electronic nodes on pages */}
              <circle cx="38" cy="62" r="1.2" fill="#38bdf8" />
              <circle cx="62" cy="62" r="1.2" fill="#38bdf8" />
              <line x1="38" y1="62" x2="46" y2="62" stroke="#38bdf8" strokeWidth="0.8" />
              <line x1="54" y1="62" x2="62" y2="62" stroke="#38bdf8" strokeWidth="0.8" />
              <defs>
                <linearGradient id="torch-flame" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 2. School Name Header */}
        <div>
          <h2 className="text-base sm:text-lg font-black tracking-widest uppercase text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {settings.schoolName || 'SMP NEGERI SATAP 4 PALASA'}
          </h2>
          <p className="text-[11px] sm:text-xs text-blue-200/80 tracking-wide font-medium mt-0.5">
            KABUPATEN PARIGI MOUTONG • SULAWESI TENGAH
          </p>
        </div>

        {/* 3. Title: PRESENSI DIGITAL & QR CODE */}
        <div className="space-y-1 pt-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
            PRESENSI DIGITAL
          </h1>
          <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
            QR CODE
          </div>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-sm sm:max-w-md mx-auto pt-1 font-medium leading-relaxed">
            Selamat Datang di Layanan Presensi<br className="sm:hidden" /> Cepat, Aman, dan Praktis
          </p>
        </div>

        {/* 4. Centerpiece: 3D Isometric Holographic Phone with Floating QR & Characters */}
        <div className="relative w-full max-w-xs sm:max-w-sm h-56 sm:h-64 flex items-center justify-center my-2">
          {/* Glowing Radial Platform */}
          <div className="absolute bottom-2 w-64 h-16 bg-blue-500/20 rounded-[100%] blur-md border border-cyan-400/30"></div>
          <div className="absolute bottom-6 w-48 h-10 bg-cyan-400/30 rounded-[100%] blur-sm"></div>

          {/* 3D Isometric Smartphone Body */}
          <div className="relative w-44 sm:w-52 h-44 sm:h-50 rounded-3xl bg-gradient-to-tr from-[#0b1736] via-[#102454] to-[#1c3e8a] border-2 border-cyan-400/50 shadow-2xl p-2.5 flex flex-col justify-between transform -rotate-x-12 rotate-y-6 hover:rotate-0 transition-transform duration-500">
            {/* Screen Notch & Camera */}
            <div className="w-12 h-2 rounded-full bg-slate-900 mx-auto border border-blue-800"></div>

            {/* Glowing Hologram QR Code in Center */}
            <div className="relative my-auto flex flex-col items-center justify-center p-2 rounded-2xl bg-[#091530]/90 border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              {/* Scan Line Ray */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent top-1/2 -translate-y-1/2 animate-bounce drop-shadow-[0_0_8px_#38bdf8]"></div>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-qrcode text-3xl sm:text-4xl text-[#0d1e44]"></i>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 mt-1 font-mono tracking-wider">
                READY SCAN
              </span>
            </div>

            {/* Micro Phone Base */}
            <div className="flex items-center justify-between text-[8px] text-blue-300/70 px-2 font-mono">
              <span>SMP SATAP 4</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
              </span>
            </div>
          </div>

          {/* Floating Success Checkmark Badges */}
          <div className="absolute -top-1 left-4 sm:left-6 px-2.5 py-1.5 rounded-xl bg-blue-900/90 border border-cyan-400/60 shadow-lg flex items-center gap-1.5 text-xs text-cyan-200 animate-pulse">
            <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
              ✓
            </div>
            <span className="font-bold text-[10px]">Tervalidasi</span>
          </div>

          {/* Floating Live Clock Badge */}
          <div className="absolute top-2 right-4 sm:right-6 px-2.5 py-1.5 rounded-xl bg-blue-900/90 border border-amber-400/60 shadow-lg flex items-center gap-1.5 text-xs text-amber-200">
            <i className="fa-regular fa-clock text-amber-300 text-xs"></i>
            <span className="font-bold text-[10px]">Tepat Waktu</span>
          </div>

          {/* Floating Quick Stat Indicator */}
          <div className="absolute -bottom-2 right-6 px-2.5 py-1 rounded-xl bg-[#0a1633]/90 border border-blue-500/50 shadow-md text-[10px] text-blue-200 flex items-center gap-1.5">
            <i className="fa-solid fa-user-check text-blue-400"></i>
            <span>Hari ini: <strong className="text-white font-mono">{presentCount}</strong> Siswa</span>
          </div>
        </div>

        {/* 5. Cybernetic Futuristic Button (Exact Match to Reference Style) */}
        <div className="w-full max-w-sm pt-2">
          <button
            type="button"
            onClick={onStartScan}
            className="relative group w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 hover:from-amber-400/30 hover:to-amber-500/30 border-2 border-amber-400/90 hover:border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-4"
          >
            {/* Corner Tech Accents */}
            <span className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-300"></span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-300"></span>
            <span className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-300"></span>
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-300"></span>

            {/* Outlined Golden QR Icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-amber-400/80 bg-amber-950/60 flex items-center justify-center text-amber-300 text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-qrcode"></i>
            </div>

            {/* Button Text */}
            <div className="text-left">
              <div className="text-xs sm:text-sm font-black tracking-wider text-amber-300 uppercase leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                PINDAI SEKARANG
              </div>
              <div className="text-sm sm:text-base font-black tracking-widest text-white uppercase mt-0.5 leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                MULAI PRESENSI
              </div>
            </div>

            <i className="fa-solid fa-arrow-right text-amber-300 text-sm ml-auto group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>

        {/* 6. Secondary Quick Navigation Grid */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onOpenDashboard}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-900/50 hover:bg-blue-800/70 border border-blue-600/50 text-blue-100 hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-chart-pie text-blue-300"></i>
            <span>Dashboard Rekap</span>
          </button>

          <button
            type="button"
            onClick={onOpenStudents}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-900/50 hover:bg-blue-800/70 border border-blue-600/50 text-blue-100 hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-id-card text-blue-300"></i>
            <span>Data Siswa & Kartu</span>
          </button>

          {onOpenLessonSchedule && (
            <button
              type="button"
              onClick={onOpenLessonSchedule}
              className="col-span-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-clock text-amber-300"></i>
              <span>Jadwal Jam Mapel</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenLogin}
            className="col-span-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-700/60 text-blue-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-user-lock text-cyan-300"></i>
            <span>{currentTeacher ? currentTeacher.name.split(' ')[0] : 'Login Guru'}</span>
          </button>
        </div>
      </div>

      {/* 7. Footer: Powered by PWA • Versi 2.0 (Exact Match to Reference Image) */}
      <div className="relative z-10 w-full max-w-md pt-4 mt-auto border-t border-blue-800/40 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-200/90 tracking-wide">
          <span>Powered by PWA</span>
          <span>•</span>
          <span className="font-mono text-cyan-300 font-bold">Versi 2.0</span>
        </div>

        <div className="flex items-center justify-center gap-3 text-[11px] text-blue-300/70">
          <span>{settings.schoolName}</span>
          <span>•</span>
          <span>TA {settings.academicYear}</span>
        </div>

        {/* PWA Install Button Helper */}
        <div className="pt-1 flex justify-center">
          <PWAInstallButton variant="compact" />
        </div>
      </div>
    </div>
  );
};
