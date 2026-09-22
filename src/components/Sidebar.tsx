import React from 'react';
import { ActiveTab, SystemSettings, Teacher } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  todayCount: number;
  settings: SystemSettings;
  currentTeacher: Teacher | null;
  onOpenLogin: () => void;
  onLogout?: () => void;
  onOpenTeacherManage: () => void;
  onOpenCloudSync: () => void;
  onOpenAdminProfile?: () => void;
  onOpenAnnouncement?: () => void;
  onOpenLessonSchedule?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  todayCount,
  settings,
  currentTeacher,
  onOpenLogin,
  onLogout,
  onOpenTeacherManage,
  onOpenCloudSync,
  onOpenAdminProfile,
  onOpenAnnouncement,
  onOpenLessonSchedule,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Navigation Items:
  // 1. BERANDA PWA (Tampilan Awal Layanan Presensi)
  // 2. DASHBOARD & REKAP
  // 3. SCAN QR ABSENSI
  // 4. DATA SISWA & KARTU
  // 5. PENGATURAN
  const mainNavItems = [
    {
      id: 'home' as ActiveTab,
      label: 'BERANDA PWA',
      icon: 'fa-solid fa-mobile-screen-button',
      badge: 'BARU',
      badgeClass: 'bg-cyan-400 text-slate-950 font-bold',
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'DASHBOARD & REKAP',
      icon: 'fa-solid fa-chart-pie',
      badge: null,
    },
    {
      id: 'scanner' as ActiveTab,
      label: 'SCAN QR ABSENSI',
      icon: 'fa-solid fa-qrcode',
      badge: 'LIVE',
      badgeClass: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'students' as ActiveTab,
      label: 'DATA SISWA & KARTU',
      icon: 'fa-solid fa-id-card',
      badge: null,
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'PENGATURAN',
      icon: 'fa-solid fa-gear',
      badge: null,
    },
  ];

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleTriggerAction = (action: () => void) => {
    action();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 text-blue-100">
      {/* Top: School Brand Identity */}
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#1e3a8a] dark:border-[#162a52]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/40 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-950/50 shrink-0">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm leading-tight text-white truncate">
                {settings.schoolName || 'SMP NEGERI SATAP 4 PALASA'}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#162f5c] text-blue-200 border border-[#234b91]">
                  TA {settings.academicYear}
                </span>
                <span className="text-[10px] text-blue-300/70 truncate">
                  Presensi QR
                </span>
              </div>
            </div>
          </div>

          {/* Close button for Mobile Drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-[#162f5c] transition-colors"
              title="Tutup Menu"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          )}
        </div>

        {/* Section: Menu Navigasi Utama */}
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300/70 mb-2.5 px-2">
            Menu Navigasi
          </div>
          <nav className="space-y-1.5">
            {/* Main Tab Navigation */}
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <React.Fragment key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm shadow-blue-950/40 border border-blue-400/40'
                        : 'text-blue-100 hover:bg-[#162f5c] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <i
                        className={`${item.icon} text-sm w-4 text-center ${
                          isActive ? 'text-white' : 'text-blue-300/70'
                        }`}
                      ></i>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.id === 'dashboard' && todayCount > 0 && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-blue-950 text-white'
                              : 'bg-[#162f5c] text-blue-200 border border-[#234b91]'
                          }`}
                        >
                          {todayCount}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Navigasi JADWAL JAM MAPEL tepat di bawah DATA SISWA & KARTU */}
                  {item.id === 'students' && onOpenLessonSchedule && (
                    <button
                      type="button"
                      onClick={() => handleTriggerAction(onOpenLessonSchedule)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-[#162f5c] hover:bg-[#1e3e78] text-blue-100 hover:text-white border border-[#234b91] shadow-xs cursor-pointer ml-0"
                      title="Lihat Struktur Jam & Jadwal Pelajaran SMP (Template Excel & Edit Jadwal)"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-clock text-amber-300 text-sm w-4 text-center"></i>
                        <span>JADWAL JAM MAPEL</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60">
                        SMP
                      </span>
                    </button>
                  )}
                </React.Fragment>
              );
            })}

            {/* SINKRON DATA (WAJIB TIAP HARI SELESAI ABSEN) */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => handleTriggerAction(onOpenCloudSync)}
                className="w-full flex flex-col items-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-blue-950/80 hover:bg-blue-900 text-amber-200 border border-amber-500/40 hover:border-amber-400 shadow-sm group cursor-pointer"
                title="Sinkronisasi Data ke Firestore (Wajib Dilakukan Tiap Hari Setelah Presensi Selesai)"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-cloud-arrow-up text-amber-400 text-sm w-4 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="text-white font-extrabold">SINKRON DATA</span>
                  </div>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-2xs">
                    Wajib
                  </span>
                </div>
                <div className="text-[10px] text-amber-300/90 font-medium mt-1 pl-6.5 leading-tight">
                  (Wajib tiap hari selesai absen)
                </div>
              </button>
            </div>

            {/* DATA GURU & PENGGUNA */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => handleTriggerAction(onOpenTeacherManage)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-[#162f5c] hover:bg-[#1e3e78] text-blue-100 hover:text-white border border-[#234b91] shadow-xs cursor-pointer"
                title="Kelola Data Guru, Akun Pengguna, dan PIN Akses"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-users-gear text-blue-300 text-sm w-4 text-center"></i>
                  <span>DATA GURU & PENGGUNA</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/60">
                  Kelola
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Section: Pemberitahuan Sistem */}
        {onOpenAnnouncement && (
          <div className="pt-2 border-t border-[#1e3a8a]/70 dark:border-[#162a52]">
            <button
              type="button"
              onClick={() => handleTriggerAction(onOpenAnnouncement)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                currentTeacher?.role === 'admin'
                  ? 'text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/50'
                  : 'text-blue-200 bg-[#162f5c]/70 hover:bg-[#1e3e78] border border-[#234b91]/60'
              }`}
              title="Buka Pemberitahuan Sistem Sekolah"
            >
              <div className="flex items-center gap-2.5 truncate">
                <i
                  className={`fa-solid fa-bullhorn text-xs w-4 text-center shrink-0 ${
                    currentTeacher?.role === 'admin' ? 'text-amber-400' : 'text-blue-300'
                  }`}
                ></i>
                <span className="truncate text-[11px] font-bold">Pemberitahuan Sistem</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-blue-200 shrink-0">
                {(settings.notifications?.length || 0)}
              </span>
            </button>
          </div>
        )}
        {/* Section: Install Aplikasi (PWA) */}
        <div className="pt-2 border-t border-[#1e3a8a]/70 dark:border-[#162a52]">
          <PWAInstallButton variant="sidebar" />
        </div>
      </div>

      {/* Bottom: Profil Pengguna Aktif & Logout */}
      <div className="pt-4 border-t border-[#1e3a8a] dark:border-[#162a52] mt-4">
        {currentTeacher ? (
          <div className="bg-[#132850] dark:bg-[#0c1b38] border border-[#1e3a8a] dark:border-[#162a52] rounded-2xl p-3 shadow-2xs">
            {/* Teacher Identity */}
            <div className="flex items-start gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                  currentTeacher.role === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                <i
                  className={
                    currentTeacher.role === 'admin'
                      ? 'fa-solid fa-shield-halved text-xs'
                      : 'fa-solid fa-user-tie text-xs'
                  }
                ></i>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-white truncate" title={currentTeacher.name}>
                  {currentTeacher.name}
                </div>
                <div className="text-[10px] text-blue-300/70 truncate">
                  {currentTeacher.email || 'Guru Terdaftar'}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span
                    className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      currentTeacher.role === 'admin'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : currentTeacher.homeroomClass
                        ? 'bg-[#1e3a8a] text-blue-200 border border-[#2563eb]'
                        : 'bg-[#162f5c] text-blue-300'
                    }`}
                  >
                    {currentTeacher.role === 'admin'
                      ? 'Admin Utama'
                      : currentTeacher.homeroomClass
                      ? `Wali Kelas ${currentTeacher.homeroomClass}`
                      : currentTeacher.subject || 'Guru Mapel'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-2.5 border-t border-[#1e3a8a]/70 dark:border-[#162a52] space-y-1">
              {currentTeacher.role === 'admin' && onOpenAdminProfile && (
                <button
                  type="button"
                  onClick={() => handleTriggerAction(onOpenAdminProfile)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#162f5c] text-[11px] font-medium text-blue-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-school text-blue-300 text-xs w-4"></i>
                  <span>Profil Sekolah</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  } else {
                    onOpenLogin();
                  }
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-950/80 text-[11px] font-semibold text-blue-300 hover:text-blue-100 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket text-xs w-4"></i>
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#132850] dark:bg-[#0c1b38] border border-[#1e3a8a] dark:border-[#162a52] rounded-2xl p-3 text-center">
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-[#162f5c] flex items-center justify-center text-blue-300 text-xs">
              <i className="fa-solid fa-user-lock"></i>
            </div>
            <p className="text-xs font-bold text-white">Belum Masuk Akun Guru</p>
            <p className="text-[10px] text-blue-300/70 mt-0.5 mb-2.5">
              Masuk untuk tanda tangan & presensi
            </p>
            <button
              type="button"
              onClick={() => handleTriggerAction(onOpenLogin)}
              className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-right-to-bracket text-xs"></i>
              <span>Login Akun Guru</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Locked Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 shrink-0 bg-[#0f2347] dark:bg-[#09152e] border-r border-[#1e3a8a] dark:border-[#162a52] z-30 select-none overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          ></div>

          <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-[#0f2347] dark:bg-[#09152e] border-r border-[#1e3a8a] z-50 overflow-y-auto shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* 3. Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f2347]/95 dark:bg-[#09152e]/95 backdrop-blur-md border-t border-[#1e3a8a] z-40 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white border border-blue-400/50 font-bold shadow-xs'
                    : 'text-blue-300/70 hover:text-white'
                }`}
              >
                <i className={`${item.icon} text-sm mb-0.5 ${isActive ? 'text-white' : 'text-blue-300'}`}></i>
                <span className="text-[9px] truncate max-w-full font-bold">
                  {item.id === 'home' ? 'Beranda' : item.id === 'dashboard' ? 'Rekap' : item.id === 'scanner' ? 'Scan' : item.id === 'students' ? 'Siswa' : 'Pengaturan'}
                </span>
              </button>
            );
          })}
          {/* Quick Sinkron Data button on mobile */}
          <button
            type="button"
            onClick={onOpenCloudSync}
            className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
            title="Sinkron Data (Wajib)"
          >
            <i className="fa-solid fa-cloud-arrow-up text-sm mb-0.5 text-amber-400"></i>
            <span className="text-[9px] truncate max-w-full font-bold text-amber-300">Sinkron</span>
          </button>
        </div>
      </nav>
    </>
  );
};
