import React, { useState, useEffect } from 'react';
import { SystemSettings, Teacher, SystemNotificationItem } from '../types';

interface DapodikAnnouncementModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
  settings: SystemSettings;
  currentTeacher?: Teacher | null;
  onUpdateSettings?: (newSettings: SystemSettings) => void;
  onNavigateToSettings?: () => void;
}

export const CURRENT_ANNOUNCEMENT_VERSION = 'v2.5.0';

export const DapodikAnnouncementModal: React.FC<DapodikAnnouncementModalProps> = ({
  isOpen,
  onClose,
  settings,
  currentTeacher,
  onUpdateSettings,
  onNavigateToSettings,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingNotifId, setEditingNotifId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const isAdmin = currentTeacher?.role === 'admin';
  const notifications: SystemNotificationItem[] = settings.notifications || [];

  // Initialize date default
  useEffect(() => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setDate(today);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(dontShowAgain);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, dontShowAgain]);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  // Create or Update notification
  const handleSubmitNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !onUpdateSettings) return;

    if (!title.trim() || !content.trim()) return;

    const formattedDate = date.trim() || new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let updatedList: SystemNotificationItem[] = [];

    if (editingNotifId) {
      // Edit existing
      updatedList = notifications.map((item) =>
        item.id === editingNotifId
          ? {
              ...item,
              title: title.trim(),
              content: content.trim(),
              date: formattedDate,
            }
          : item
      );
      showFeedback('Pemberitahuan berhasil diperbarui!');
    } else {
      // Add new notification
      const newNotif: SystemNotificationItem = {
        id: `notif-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        date: formattedDate,
        author: currentTeacher?.name || 'Administrator',
      };
      // Place new notification
      updatedList = [newNotif, ...notifications];
      showFeedback('Pemberitahuan baru berhasil dipublikasikan!');
    }

    onUpdateSettings({
      ...settings,
      notifications: updatedList,
      announcementTitle: updatedList[0]?.title || '',
      announcementContent: updatedList[0]?.content || '',
      announcementDate: updatedList[0]?.date || '',
    });

    // Reset form
    setTitle('');
    setContent('');
    setIsCreating(false);
    setEditingNotifId(null);
  };

  // Delete single notification
  const handleDeleteNotification = (id: string) => {
    if (!isAdmin || !onUpdateSettings) return;
    const remaining = notifications.filter((item) => item.id !== id);

    onUpdateSettings({
      ...settings,
      notifications: remaining,
      announcementTitle: remaining[0]?.title || '',
      announcementContent: remaining[0]?.content || '',
      announcementDate: remaining[0]?.date || '',
    });

    showFeedback('Pemberitahuan berhasil dihapus.');
  };

  // Clear all notifications
  const handleClearAll = () => {
    if (!isAdmin || !onUpdateSettings) return;
    if (window.confirm('Kosongkan semua daftar pemberitahuan sistem?')) {
      onUpdateSettings({
        ...settings,
        notifications: [],
        announcementTitle: '',
        announcementContent: '',
        announcementDate: '',
      });
      showFeedback('Semua pemberitahuan sistem telah dikosongkan.');
      setIsCreating(false);
      setEditingNotifId(null);
    }
  };

  // Start editing a notification
  const handleStartEdit = (notif: SystemNotificationItem) => {
    setEditingNotifId(notif.id);
    setTitle(notif.title);
    setContent(notif.content);
    setDate(notif.date);
    setIsCreating(true);
  };

  return (
    <div
      id="dapodik-announcement-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose(dontShowAgain);
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#032920] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1d4ed8] overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-800 via-sky-900 to-[#09152e] text-white p-5 sm:p-6 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl sm:text-2xl shadow-inner shrink-0">
                <i className="fa-solid fa-bullhorn"></i>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 shadow-2xs">
                    Pemberitahuan Sistem
                  </span>
                  <span className="text-[10px] font-bold text-blue-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                    {notifications.length} Pemberitahuan
                  </span>

                  {/* Access Badge */}
                  {isAdmin ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-700/80 flex items-center gap-1 shadow-2xs">
                      <i className="fa-solid fa-shield-halved text-[9px]"></i>
                      Admin (Kelola & Hapus)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-200 border border-blue-800 flex items-center gap-1 shadow-2xs">
                      <i className="fa-solid fa-lock text-[9px] text-amber-400"></i>
                      Guru (Hanya Melihat)
                    </span>
                  )}
                </div>

                <h2
                  id="announcement-title"
                  className="text-lg sm:text-xl font-extrabold leading-tight text-white tracking-tight"
                >
                  Informasi & Pemberitahuan Sekolah
                </h2>
                <p className="text-xs text-blue-200/90 mt-1 flex items-center gap-2 flex-wrap">
                  <span>
                    <i className="fa-regular fa-building mr-1"></i>
                    {settings.schoolName || 'SMP NEGERI SATAP 4 PALASA'}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Close Button */}
            <button
              type="button"
              onClick={() => onClose(dontShowAgain)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white transition-all cursor-pointer shrink-0"
              title="Tutup Pemberitahuan"
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-700 dark:text-blue-100 text-xs sm:text-sm leading-relaxed">
          {/* Feedback alert if any */}
          {feedbackNotice && (
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 text-xs font-bold flex items-center gap-2 border border-blue-300 dark:border-blue-800 animate-fadeIn">
              <i className="fa-solid fa-circle-check text-blue-600 text-sm"></i>
              <span>{feedbackNotice}</span>
            </div>
          )}

          {/* Admin Notification Form (Create or Edit) */}
          {isAdmin && isCreating && (
            <form
              onSubmit={handleSubmitNotification}
              className="p-4 rounded-2xl bg-amber-50/90 dark:bg-[#0f2347] border-2 border-amber-400/80 dark:border-amber-600/80 space-y-3.5 shadow-sm animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-[#1d4ed8]">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wide">
                  <i className="fa-solid fa-pen-to-square text-amber-600 dark:text-amber-400"></i>
                  <span>
                    {editingNotifId ? 'Edit Pemberitahuan' : 'Buat Pemberitahuan Baru'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingNotifId(null);
                  }}
                  className="text-amber-800 hover:text-amber-950 dark:text-amber-300 text-xs font-bold"
                >
                  Batal
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Judul Pemberitahuan: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rapat Dewan Guru & Evaluasi Presensi QR"
                  className="w-full bg-white dark:bg-[#09152e] border border-amber-300 dark:border-[#2563eb] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Tanggal:
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Contoh: 16 September 2026"
                  className="w-full bg-white dark:bg-[#09152e] border border-amber-300 dark:border-[#2563eb] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Isi Pesan Pemberitahuan: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan rincian pemberitahuan untuk dewan guru dan staf sekolah..."
                  className="w-full bg-white dark:bg-[#09152e] border border-amber-300 dark:border-[#2563eb] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingNotifId(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#2563eb] text-slate-700 dark:text-blue-200 hover:bg-slate-200 dark:hover:bg-[#162f5c] text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-700 hover:from-blue-500 hover:to-sky-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  <span>{editingNotifId ? 'Simpan Perubahan' : 'Terbitkan Pemberitahuan'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Action Header for Admin (Add notification & Clear all) */}
          {isAdmin && !isCreating && (
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-[#09152e] border border-slate-200 dark:border-[#1d4ed8] rounded-2xl flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setContent('');
                  setEditingNotifId(null);
                  setIsCreating(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                <span>Buat Pemberitahuan Baru</span>
              </button>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Hapus / Kosongkan semua pemberitahuan"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                  <span>Kosongkan Semua Pemberitahuan</span>
                </button>
              )}
            </div>
          )}

          {/* List of Active Notifications */}
          {notifications.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1d4ed8] bg-slate-50/50 dark:bg-[#09152e]/50">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/80 dark:bg-[#162a52] text-blue-600 dark:text-blue-300 flex items-center justify-center text-2xl shadow-inner">
                <i className="fa-regular fa-bell-slash"></i>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">
                  Tidak Ada Pemberitahuan Sistem Saat Ini
                </h4>
                <p className="text-xs text-slate-500 dark:text-blue-300/70">
                  Daftar pembaruan dan fitur terbaru 1-6 telah dikosongkan. Jika ada pemberitahuan baru yang diajukan oleh Administrator, pemberitahuan tersebut akan tampil di sini.
                </p>
              </div>
              {isAdmin && !isCreating && (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>Tambah Pemberitahuan Pertama</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f2347] border border-slate-200 dark:border-[#1e3a8a] hover:border-blue-400/40 transition-all space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                          {item.date}
                        </span>
                        {item.author && (
                          <span className="text-[10px] text-slate-500 dark:text-blue-300/70">
                            oleh: {item.author}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    {/* Admin Action Buttons (Edit & Delete) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-[#162f5c] dark:text-blue-300 transition-colors cursor-pointer"
                          title="Edit pemberitahuan ini"
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNotification(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-rose-300 transition-colors cursor-pointer"
                          title="Hapus pemberitahuan ini"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-blue-100 whitespace-pre-line leading-relaxed font-normal pt-1">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#09152e] border-t border-slate-200/90 dark:border-[#1d4ed8] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-blue-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded text-blue-700 focus:ring-blue-600 dark:focus:ring-blue-500 cursor-pointer accent-blue-700"
            />
            <span>Jangan tampilkan lagi secara otomatis</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isAdmin && onNavigateToSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose(dontShowAgain);
                  onNavigateToSettings();
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#2563eb] text-slate-700 dark:text-blue-200 hover:bg-slate-200 dark:hover:bg-[#162f5c] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-gear text-xs"></i>
                <span>Pengaturan</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onClose(dontShowAgain)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-700 hover:from-blue-500 hover:to-sky-600 text-white text-xs font-extrabold shadow-md shadow-blue-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-check text-xs"></i>
              <span>Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
