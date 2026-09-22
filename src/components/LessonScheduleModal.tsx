import React, { useState, useMemo, useRef } from 'react';
import { LessonPeriod, SubjectScheduleItem, Teacher } from '../types';
import { DEFAULT_LESSON_PERIODS, DEFAULT_SMP_SUBJECTS, getIndonesianDayName } from '../data/lessonSchedule';
import { SMP_CLASSES } from '../data/initialData';
import { downloadScheduleTemplateExcel, parseScheduleExcelFile } from '../utils/excel';

interface LessonScheduleModalProps {
  periods?: LessonPeriod[];
  schedule: SubjectScheduleItem[];
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  availableClasses?: string[];
  onClose: () => void;
  onUpdateSchedule?: (newSchedule: SubjectScheduleItem[]) => void;
  onUpdatePeriods?: (newPeriods: LessonPeriod[]) => void;
  onStartMapelAttendance?: (period: LessonPeriod, subject: string, classRoom: string) => void;
}

export const LessonScheduleModal: React.FC<LessonScheduleModalProps> = ({
  periods = DEFAULT_LESSON_PERIODS,
  schedule,
  teachers,
  currentTeacher,
  availableClasses,
  onClose,
  onUpdateSchedule,
  onUpdatePeriods,
  onStartMapelAttendance,
}) => {
  const [activeDay, setActiveDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>(
    () => getIndonesianDayName()
  );
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('Semua');

  // Resolved list of classes from settings or fallback to default
  const activeClassList = useMemo(() => {
    if (availableClasses && availableClasses.length > 0) {
      return availableClasses;
    }
    return SMP_CLASSES;
  }, [availableClasses]);

  // Form State for Adding/Editing Schedule Item
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [formDay, setFormDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Senin');
  const [formPeriodId, setFormPeriodId] = useState<string>('p-1');
  const [formClassRoom, setFormClassRoom] = useState<string>(activeClassList[0] || 'Kelas 7A');
  const [formSubject, setFormSubject] = useState<string>('Matematika');
  const [formTeacherName, setFormTeacherName] = useState<string>(
    currentTeacher?.name || teachers[0]?.name || 'HENDRA WIJAYA, S.Pd.'
  );

  // Excel file upload ref & state
  const excelFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImportingExcel, setIsImportingExcel] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const isAdmin = currentTeacher?.role === 'admin' || currentTeacher?.teacherType === 'admin';

  // Filtered schedule items for active day & class/teacher
  const daySchedule = useMemo(() => {
    return schedule.filter((item) => {
      if (item.day !== activeDay) return false;
      if (selectedClassFilter !== 'Semua' && item.classRoom !== selectedClassFilter) return false;
      if (selectedTeacherFilter !== 'Semua' && item.teacherName !== selectedTeacherFilter) return false;
      return true;
    });
  }, [schedule, activeDay, selectedClassFilter, selectedTeacherFilter]);

  const handleOpenAddNew = () => {
    setEditingScheduleId(null);
    setFormDay(activeDay);
    setFormPeriodId('p-1');
    setFormClassRoom(activeClassList[0] || 'Kelas 7A');
    setFormSubject('Matematika');
    setFormTeacherName(currentTeacher?.name || teachers[0]?.name || 'HENDRA WIJAYA, S.Pd.');
    setIsAddingNew(true);
  };

  const handleOpenEditItem = (item: SubjectScheduleItem) => {
    setEditingScheduleId(item.id);
    setFormDay(item.day);
    setFormPeriodId(item.periodId);
    setFormClassRoom(item.classRoom);
    setFormSubject(item.subject);
    setFormTeacherName(item.teacherName);
    setIsAddingNew(true);
  };

  const handleSaveScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    const periodObj = periods.find((p) => p.id === formPeriodId);
    const periodName = periodObj ? `${periodObj.name} (${periodObj.startTime} - ${periodObj.endTime})` : 'Jam Ke-1';

    if (editingScheduleId) {
      // Update existing item
      const updated = schedule.map((s) => {
        if (s.id === editingScheduleId) {
          return {
            ...s,
            day: formDay,
            periodId: formPeriodId,
            periodNumber: periodObj?.periodNumber || s.periodNumber,
            periodName,
            classRoom: formClassRoom,
            subject: formSubject,
            teacherName: formTeacherName,
          };
        }
        return s;
      });

      if (onUpdateSchedule) {
        onUpdateSchedule(updated);
      }
    } else {
      // Add new item
      const newItem: SubjectScheduleItem = {
        id: `sch-${Date.now()}`,
        day: formDay,
        periodId: formPeriodId,
        periodNumber: periodObj?.periodNumber || 1,
        periodName,
        classRoom: formClassRoom,
        subject: formSubject,
        teacherName: formTeacherName,
      };

      if (onUpdateSchedule) {
        onUpdateSchedule([...schedule, newItem]);
      }
    }

    setIsAddingNew(false);
    setEditingScheduleId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Hapus jadwal pelajaran ini?')) {
      if (onUpdateSchedule) {
        onUpdateSchedule(schedule.filter((s) => s.id !== id));
      }
    }
  };

  const handleDownloadExcelTemplate = () => {
    downloadScheduleTemplateExcel(schedule, activeClassList);
  };

  const handleUploadExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImportingExcel(true);
    setImportMessage(null);

    try {
      const result = await parseScheduleExcelFile(file, periods);

      if (result.errors.length > 0 && result.schedule.length === 0) {
        alert(result.errors.join('\n'));
        setIsImportingExcel(false);
        if (excelFileInputRef.current) excelFileInputRef.current.value = '';
        return;
      }

      if (result.schedule.length > 0) {
        if (onUpdateSchedule) {
          onUpdateSchedule(result.schedule);
        }
        setImportMessage(`Sukses! ${result.addedCount} baris jadwal berhasil diunggah dan disusun otomatis.`);
        setTimeout(() => setImportMessage(null), 6000);
      } else {
        alert('Tidak ada baris jadwal yang terbaca dari file Excel.');
      }
    } catch (err: any) {
      alert('Gagal memproses file Excel: ' + (err.message || 'Format tidak sesuai'));
    } finally {
      setIsImportingExcel(false);
      if (excelFileInputRef.current) excelFileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Hidden Excel File Input */}
        <input
          type="file"
          ref={excelFileInputRef}
          onChange={handleUploadExcelFile}
          accept=".xlsx,.xls"
          className="hidden"
        />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-800 to-sky-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300 text-lg border border-white/20">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                Jadwal & Jam Pelajaran SMP
              </h3>
              <p className="text-xs text-blue-200/80">
                Struktur Jam Pelajaran, Template Excel & Jadwal Mengajar Guru Mapel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Excel Quick Toolbar (Download Template & Unggah Ulang) */}
        <div className="px-5 py-2.5 bg-blue-900/90 text-white flex flex-wrap items-center justify-between gap-2 border-b border-blue-800/80 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-200 flex items-center gap-1.5">
              <i className="fa-solid fa-file-excel text-blue-400"></i>
              <span>Sinkronisasi Jadwal via Excel:</span>
            </span>
            <span className="text-[11px] text-blue-100/70 hidden md:inline">
              Download template, edit di Excel, lalu unggah ulang agar tersusun otomatis.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadExcelTemplate}
              className="px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-blue-100 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs border border-blue-600/60 cursor-pointer text-xs"
              title="Download Template Jadwal Pelajaran Excel (.xlsx)"
            >
              <i className="fa-solid fa-download text-blue-300"></i>
              <span>Download Template Excel</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => excelFileInputRef.current?.click()}
                disabled={isImportingExcel}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer text-xs disabled:opacity-50"
                title="Unggah File Excel Jadwal yang Sudah Diedit"
              >
                <i className={`fa-solid ${isImportingExcel ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                <span>{isImportingExcel ? 'Mengunggah...' : 'Unggah Excel Jadwal'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification banner if import succeeded */}
        {importMessage && (
          <div className="px-5 py-2 bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-b border-blue-300 dark:border-blue-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0">
            <i className="fa-solid fa-circle-check text-blue-600 dark:text-blue-400"></i>
            <span>{importMessage}</span>
          </div>
        )}

        {/* Top Control Bar: Day Pills & Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 shrink-0">
          {/* Day Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const).map((day) => {
              const isActive = activeDay === day;
              const isToday = getIndonesianDayName() === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-700/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filters and Add Schedule Button */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
                <i className="fa-solid fa-graduation-cap text-blue-600 dark:text-blue-400 text-xs"></i>
                <span className="text-slate-500 font-medium">Kelas:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="Semua" className="bg-white dark:bg-slate-800">Semua Kelas</option>
                  {activeClassList.map((cls) => (
                    <option key={cls} value={cls} className="bg-white dark:bg-slate-800">{cls}</option>
                  ))}
                </select>
              </div>

              {/* Teacher Filter */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
                <i className="fa-solid fa-chalkboard-user text-blue-600 dark:text-blue-400 text-xs"></i>
                <span className="text-slate-500 font-medium">Guru:</span>
                <select
                  value={selectedTeacherFilter}
                  onChange={(e) => setSelectedTeacherFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer max-w-[180px] truncate"
                >
                  <option value="Semua" className="bg-white dark:bg-slate-800">Semua Guru Mapel</option>
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.name} className="bg-white dark:bg-slate-800">
                      {tch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Schedule Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (isAddingNew) {
                    setIsAddingNew(false);
                    setEditingScheduleId(null);
                  } else {
                    handleOpenAddNew();
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <i className={`fa-solid ${isAddingNew ? 'fa-xmark' : 'fa-plus'}`}></i>
                <span>{isAddingNew ? 'Tutup Form' : 'Tambah Jadwal Mapel'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Schedule Item Form (Add / Edit) */}
        {isAddingNew && (
          <form
            onSubmit={handleSaveScheduleItem}
            className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs shrink-0 animate-fadeIn"
          >
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Hari</label>
              <select
                value={formDay}
                onChange={(e) => setFormDay(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Jam Pelajaran</label>
              <select
                value={formPeriodId}
                onChange={(e) => setFormPeriodId(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                {periods.filter((p) => !p.isBreak).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.startTime} - {p.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Kelas</label>
              <select
                value={formClassRoom}
                onChange={(e) => setFormClassRoom(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                {activeClassList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Mata Pelajaran</label>
              <select
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                {DEFAULT_SMP_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Guru Pengampu</label>
              <div className="flex gap-2">
                <select
                  value={formTeacherName}
                  onChange={(e) => setFormTeacherName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500 truncate text-slate-800 dark:text-slate-100"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  {editingScheduleId ? 'Simpan Edit' : 'Simpan'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Schedule Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Structure of Periods (Timeline) */}
          <div className="space-y-2.5">
            {periods.map((period) => {
              if (period.isBreak) {
                return (
                  <div
                    key={period.id}
                    className="flex items-center gap-3 py-2 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-semibold"
                  >
                    <i className="fa-solid fa-mug-hot text-sm"></i>
                    <span className="font-bold">{period.name}</span>
                    <span className="text-[11px] opacity-75">({period.startTime} - {period.endTime} WIB)</span>
                    <div className="flex-1 border-t border-dashed border-amber-300/60 dark:border-amber-700/60"></div>
                    <span className="text-[10px] uppercase font-mono tracking-wider">Waktu Istirahat Siswa</span>
                  </div>
                );
              }

              // Match schedule items for this specific period
              const periodItems = daySchedule.filter(
                (item) => item.periodId === period.id || item.periodNumber === period.periodNumber
              );

              return (
                <div
                  key={period.id}
                  className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs font-mono">
                        {period.name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {period.startTime} - {period.endTime} WIB
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-semibold">
                      {periodItems.length} Kelas Terjadwal
                    </span>
                  </div>

                  {periodItems.length === 0 ? (
                    <div className="py-3 text-center text-xs text-slate-400 italic">
                      Tidak ada jadwal mapel di jam ini (atau belum ditambahkan).
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {periodItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2 group hover:shadow-xs transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[11px]">
                                {item.classRoom}
                              </span>
                              {isAdmin && (
                                <div className="flex items-center gap-1">
                                  {/* Tombol Edit Jadwal Mapel */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditItem(item)}
                                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs transition-colors p-1"
                                    title="Edit Jadwal Mapel"
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                  {/* Tombol Hapus Jadwal */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-slate-400 hover:text-rose-500 text-xs transition-colors p-1"
                                    title="Hapus Jadwal"
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                              {item.subject}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              <i className="fa-solid fa-user-tie text-[10px] mr-1 text-slate-400"></i>
                              {item.teacherName}
                            </p>
                          </div>

                          {/* Action Button: Start Mapel Attendance */}
                          {onStartMapelAttendance && (
                            <button
                              type="button"
                              onClick={() => {
                                onStartMapelAttendance(period, item.subject, item.classRoom);
                                onClose();
                              }}
                              className="mt-1 w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                            >
                              <i className="fa-solid fa-qrcode"></i>
                              <span>Absen Masuk Jam Ini</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>SMP Negeri Satap 4 Palasa • Jam Belajar Efektif 45 Menit / Jam Pelajaran</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
