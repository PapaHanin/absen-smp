import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Html5Qrcode, CameraDevice } from 'html5-qrcode';
import { Student, AttendanceRecord, SystemSettings, Teacher, AttendanceStatus, LessonPeriod, SubjectScheduleItem } from '../types';
import { parseQRPayload } from '../utils/qr';
import { playScanBeep } from '../utils/audio';
import { openWhatsAppNotification, copyWAMessageToClipboard } from '../utils/whatsapp';
import { DEFAULT_LESSON_PERIODS, DEFAULT_SMP_SUBJECTS, getCurrentLessonPeriod, matchTeacherSubject } from '../data/lessonSchedule';
import { SMP_CLASSES } from '../data/initialData';

interface ScannerTabProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  settings: SystemSettings;
  teachers?: Teacher[];
  currentTeacher?: Teacher | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  onRecordAttendance: (
    student: Student,
    scannedVia: 'QR Camera' | 'Manual Input' | 'Simulator',
    customDate?: string,
    options?: {
      attendanceType?: 'harian' | 'mapel';
      periodNumber?: number;
      periodName?: string;
      periodStartTime?: string;
      time?: string;
      subject?: string;
      note?: string;
      status?: AttendanceStatus;
      teacherName?: string;
    }
  ) => {
    record: AttendanceRecord;
    isDuplicate: boolean;
  };
  onManualSyncCloud?: () => Promise<void>;
  isSyncingCloud?: boolean;
  periods?: LessonPeriod[];
  schedule?: SubjectScheduleItem[];
  onOpenLessonSchedule?: () => void;
  selectedPeriodId?: string;
  onSelectPeriodId?: (id: string) => void;
  selectedSubject?: string;
  onSelectSubject?: (sub: string) => void;
  selectedClassRoom?: string;
  onSelectClassRoom?: (cls: string) => void;
  scanMode?: 'harian' | 'mapel';
  onSetScanMode?: (mode: 'harian' | 'mapel') => void;
}

export const ScannerTab: React.FC<ScannerTabProps> = ({
  students,
  attendanceRecords,
  settings,
  teachers = [],
  currentTeacher,
  onOpenLogin,
  onLogout,
  onRecordAttendance,
  onManualSyncCloud,
  isSyncingCloud = false,
  periods = DEFAULT_LESSON_PERIODS,
  schedule = [],
  onOpenLessonSchedule,
  selectedPeriodId,
  onSelectPeriodId,
  selectedSubject,
  onSelectSubject,
  selectedClassRoom,
  onSelectClassRoom,
  scanMode,
  onSetScanMode,
}) => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string>('');

  // Resolve whether current teacher is dedicated to a specific subject (non-admin)
  const teacherMatchedSubject = useMemo(() => {
    if (!currentTeacher) return null;
    if (currentTeacher.role === 'admin' || currentTeacher.email === 'fadli46046@gmail.com') {
      return null;
    }
    return matchTeacherSubject(currentTeacher.subject) || currentTeacher.subject || null;
  }, [currentTeacher]);

  const isLockedByTeacher = Boolean(teacherMatchedSubject);
  // Subject is locked if opened by dedicated subject teacher OR during active QR camera scanning
  const isSubjectLocked = isLockedByTeacher || isScanning;

  // Mode: Harian (Sekolah) vs Mapel (Guru Mapel SMP)
  const [internalScanMode, setInternalScanMode] = useState<'harian' | 'mapel'>('harian');
  const activeScanMode = scanMode !== undefined ? scanMode : internalScanMode;
  const setScanMode = (mode: 'harian' | 'mapel') => {
    if (onSetScanMode) onSetScanMode(mode);
    setInternalScanMode(mode);
  };

  const activeCurrentPeriod = useMemo(() => getCurrentLessonPeriod(), []);
  const [internalPeriodId, setInternalPeriodId] = useState<string>(() => activeCurrentPeriod?.id || 'p-1');
  const activePeriodId = selectedPeriodId !== undefined ? selectedPeriodId : internalPeriodId;
  const setActivePeriodId = (id: string) => {
    if (onSelectPeriodId) onSelectPeriodId(id);
    setInternalPeriodId(id);
  };

  const [internalSubject, setInternalSubject] = useState<string>(() => {
    if (teacherMatchedSubject) return teacherMatchedSubject;
    if (currentTeacher?.subject) {
      return matchTeacherSubject(currentTeacher.subject) || currentTeacher.subject;
    }
    return DEFAULT_SMP_SUBJECTS[0];
  });
  const activeSubject = selectedSubject !== undefined ? selectedSubject : internalSubject;
  const setActiveSubject = (sub: string) => {
    if (onSelectSubject) onSelectSubject(sub);
    setInternalSubject(sub);
  };

  const [internalClassRoom, setInternalClassRoom] = useState<string>(() => currentTeacher?.homeroomClass || SMP_CLASSES[0]);
  const activeClassRoom = selectedClassRoom !== undefined ? selectedClassRoom : internalClassRoom;
  const setActiveClassRoom = (cls: string) => {
    if (onSelectClassRoom) onSelectClassRoom(cls);
    setInternalClassRoom(cls);
  };

  // Automatically lock and apply subject when a subject teacher is active
  useEffect(() => {
    if (teacherMatchedSubject) {
      setActiveSubject(teacherMatchedSubject);
      if (activeScanMode !== 'mapel') {
        setScanMode('mapel');
      }
      if (currentTeacher?.homeroomClass) {
        setActiveClassRoom(currentTeacher.homeroomClass);
      }
    }
  }, [teacherMatchedSubject, currentTeacher?.homeroomClass]);

  const [isQuickChecklistOpen, setIsQuickChecklistOpen] = useState<boolean>(false);
  const [quickChecklistSearch, setQuickChecklistSearch] = useState<string>('');

  // Permission API state ('granted' | 'denied' | 'prompt')
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  // Manual payload/NIS input for testing without camera
  const [manualInput, setManualInput] = useState<string>('');

  // Scan Result Modal
  const [lastScanResult, setLastScanResult] = useState<{
    student: Student;
    record: AttendanceRecord;
    isDuplicate: boolean;
  } | null>(null);

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const lastScannedTimeRef = useRef<{ [nis: string]: number }>({});
  const scannerContainerId = 'qr-reader-container';

  // Check Camera Permission quietly via Permissions API
  const checkCameraPermission = useCallback(async (): Promise<'granted' | 'denied' | 'prompt'> => {
    try {
      if (typeof window !== 'undefined' && navigator?.permissions?.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(result.state);
        
        result.onchange = () => {
          setPermissionState(result.state);
        };
        return result.state;
      }
    } catch {
      // Ignore permission query support errors
    }
    return 'prompt';
  }, []);

  // Date selection state for scanner
  const getTodayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayISO = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const formatIndonesianDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Process a scanned payload (from camera, file, or manual input) with scan throttling
  const processPayload = useCallback(
    (rawText: string, via: 'QR Camera' | 'Manual Input' | 'Simulator') => {
      const parsed = parseQRPayload(rawText);
      const cleanNis = parsed.nis.trim().toLowerCase();

      // Throttle camera scans for the same NIS (minimum 2.5s delay)
      if (via === 'QR Camera') {
        const lastTime = lastScannedTimeRef.current[cleanNis] || 0;
        const now = Date.now();
        if (now - lastTime < 2500) {
          return;
        }
        lastScannedTimeRef.current[cleanNis] = now;
      }

      const student = students.find(
        (s) => s.nis.toLowerCase() === cleanNis
      );

      if (!student) {
        playScanBeep(false);
        setScanError(`QR Code / NIS "${parsed.nis}" tidak ditemukan dalam database siswa.`);
        return;
      }

      setScanError('');

      const currentPeriodObj = periods.find((p) => p.id === activePeriodId);
      const recordOptions =
        activeScanMode === 'mapel'
          ? {
              attendanceType: 'mapel' as const,
              periodNumber: currentPeriodObj?.periodNumber || 1,
              periodName: currentPeriodObj
                ? `${currentPeriodObj.name} (${currentPeriodObj.startTime} - ${currentPeriodObj.endTime})`
                : 'Jam Mapel',
              periodStartTime: currentPeriodObj?.startTime,
              time: currentPeriodObj?.startTime || '08:00',
              subject: activeSubject,
              teacherName: currentTeacher?.name,
              note: `Presensi Mapel ${activeSubject} - ${currentPeriodObj?.name || 'Jam Pelajaran'}`,
            }
          : undefined;

      const { record, isDuplicate } = onRecordAttendance(student, via, selectedDate, recordOptions);
      playScanBeep(!isDuplicate);
      setLastScanResult({ student, record, isDuplicate });
    },
    [
      students,
      onRecordAttendance,
      selectedDate,
      activeScanMode,
      periods,
      activePeriodId,
      activeSubject,
      currentTeacher,
    ]
  );

  // Fetch camera devices silently without showing intrusive errors on load
  const loadCameraDevices = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices) return;

      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        if (!selectedCameraId) {
          setSelectedCameraId(devices[0].id);
        }
        setPermissionState('granted');
      }
    } catch {
      // Silently catch - user hasn't granted camera permissions yet
    }
  }, [selectedCameraId]);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason?.message || String(event.reason || '');
      if (
        msg.includes('play() request was interrupted') ||
        msg.includes('media was removed from the document') ||
        msg.includes('The node to be removed is not a child')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    checkCameraPermission().then((status) => {
      if (status === 'granted') {
        loadCameraDevices();
      }
    });

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);

      if (html5QrcodeRef.current) {
        try {
          if (html5QrcodeRef.current.isScanning) {
            html5QrcodeRef.current.stop().catch(() => {});
          }
          html5QrcodeRef.current.clear();
        } catch (e) {
          console.warn('Error during scanner cleanup:', e);
        }
        html5QrcodeRef.current = null;
      }
    };
  }, [checkCameraPermission, loadCameraDevices]);

  // Start Camera Scanning cleanly with fallbacks
  const startScanner = async () => {
    setScanError('');
    setIsStartingCamera(true);

    try {
      // Step 1: Explicitly request camera media stream first to trigger native browser prompt
      if (navigator?.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((track) => track.stop());
          setPermissionState('granted');
        } catch (userMediaErr: unknown) {
          const msg = userMediaErr instanceof Error ? userMediaErr.message : String(userMediaErr);
          if (msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('notallowed')) {
            setPermissionState('denied');
            setScanError('Akses kamera ditolak di browser. Mohon beri izin akses kamera di pengaturan browser Anda.');
            setIsStartingCamera(false);
            return;
          }
        }
      }

      // Step 2: Refresh camera list after permission is granted
      await loadCameraDevices();

      const containerEl = document.getElementById(scannerContainerId);
      if (!containerEl) {
        setScanError('Kontainer pemindai tidak ditemukan di layar.');
        setIsStartingCamera(false);
        return;
      }

      // Step 3: Stop & clear any existing scanner instance
      if (html5QrcodeRef.current) {
        try {
          if (html5QrcodeRef.current.isScanning) {
            await html5QrcodeRef.current.stop();
          }
          html5QrcodeRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
        html5QrcodeRef.current = null;
      }

      containerEl.innerHTML = '';

      // Step 4: Initialize Html5Qrcode
      const scanner = new Html5Qrcode(scannerContainerId);
      html5QrcodeRef.current = scanner;

      // Determine camera config with fallback options
      const cameraConfig = selectedCameraId || { facingMode: 'environment' };

      const qrConfig = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      };

      try {
        await scanner.start(
          cameraConfig,
          qrConfig,
          (decodedText) => {
            processPayload(decodedText, 'QR Camera');
          },
          () => {}
        );
      } catch (firstErr) {
        console.warn('First camera start attempt failed, trying fallback constraint:', firstErr);
        // Fallback to basic video constraint if specific camera ID failed
        await scanner.start(
          { facingMode: 'user' },
          qrConfig,
          (decodedText) => {
            processPayload(decodedText, 'QR Camera');
          },
          () => {}
        );
      }

      setIsScanning(true);
      setPermissionState('granted');
      setScanError('');
    } catch (err: unknown) {
      console.warn('Failed to start scanner:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.toLowerCase().includes('notallowed') || errorMsg.toLowerCase().includes('denied')) {
        setPermissionState('denied');
        setScanError('Akses kamera diblokir. Izinkan akses kamera melalui ikon gembok di sebelah URL browser.');
      } else {
        setScanError(`Gagal membuka kamera (${errorMsg}). Anda dapat menggunakan fitur Unggah Gambar QR atau Input NIS Manual.`);
      }
      setIsScanning(false);
    } finally {
      setIsStartingCamera(false);
    }
  };

  // Stop Camera Scanning
  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch (err) {
        console.warn('Failed to stop scanner:', err);
      }
      html5QrcodeRef.current = null;
    }
    setIsScanning(false);

    const containerEl = document.getElementById(scannerContainerId);
    if (containerEl) {
      containerEl.innerHTML = '';
    }
  };

  // Upload & Scan QR Code from image file
  const handleQRFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setScanError('');

    try {
      // If camera is currently active, stop it before file scanning
      if (isScanning) {
        await stopScanner();
      }

      const tempScanner = new Html5Qrcode('qr-file-temp-container');
      const decodedText = await tempScanner.scanFile(file, true);
      tempScanner.clear();

      if (decodedText) {
        processPayload(decodedText, 'QR Camera');
      } else {
        setScanError('Tidak dapat mendeteksi Kode QR dari gambar ini. Pastikan gambar QR terlihat jelas.');
      }
    } catch (err) {
      console.warn('Error reading QR file:', err);
      setScanError('Gagal membaca Kode QR pada file gambar. Pastikan gambar tidak buram dan fokus.');
    } finally {
      setIsProcessingFile(false);
      // Reset input value so user can re-upload same file if needed
      e.target.value = '';
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processPayload(manualInput.trim(), 'Manual Input');
    setManualInput('');
  };

  return (
    <div className="space-y-6">
      {/* Hidden temporary element for file scanning */}
      <div id="qr-file-temp-container" className="hidden" />

      {/* Tab Title */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-camera-retro text-rose-600"></i>
            <span>Pemindai QR Code Presensi Siswa SD</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Arahkan Kartu QR Pelajar ke kamera, atau unggah foto QR untuk mencatat jam masuk secara otomatis.
          </p>
        </div>

        {/* Camera Selector & Start/Stop Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {cameras.length > 0 && (
            <select
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              disabled={isScanning || isStartingCamera}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  📷 {cam.label || `Kamera ${cam.id.slice(0, 5)}`}
                </option>
              ))}
            </select>
          )}

          {!isScanning ? (
            <button
              onClick={startScanner}
              disabled={isStartingCamera}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <i className={`fa-solid ${isStartingCamera ? 'fa-spinner fa-spin' : 'fa-play'} text-xs`}></i>
              <span>{isStartingCamera ? 'Membuka Kamera...' : 'Mulai Kamera'}</span>
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-stop text-xs"></i>
              <span>Hentikan Kamera</span>
            </button>
          )}

          {/* Open in new tab helper */}
          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all text-xs font-bold cursor-pointer"
            title="Buka Aplikasi di Tab Baru (Untuk Izin Kamera Lebih Stabil)"
          >
            <i className="fa-solid fa-up-right-from-square"></i>
          </a>
        </div>
      </div>

      {/* Active Teacher Banner */}
      {(() => {
        if (!currentTeacher) {
          return (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base font-bold shadow-xs shrink-0">
                  <i className="fa-solid fa-user-lock"></i>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 block leading-tight">
                    Status Akun Petugas:
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap mt-0.5">
                    <span>Pengguna Tamu (Belum Masuk Akun Guru)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Mode Tamu
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Silakan masuk menggunakan Email dan PIN masing-masing agar nama Anda tercatat sebagai guru pengabsen.
                  </span>
                </div>
              </div>

              {/* Action Button: Login with Email and PIN */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <span>Masuk Akun Guru (Email & PIN)</span>
                  </button>
                )}
              </div>
            </div>
          );
        }

        const activeT = currentTeacher;

        return (
          <div className="bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base font-bold shadow-xs shrink-0">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Guru yang Sedang Bertugas Mengabsen:
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap mt-0.5">
                  <span>{activeT.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeT.teacherType === 'wali_kelas'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : activeT.teacherType === 'guru_mapel'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}
                  >
                    {activeT.teacherType === 'wali_kelas'
                      ? activeT.homeroomClass
                        ? `Wali ${activeT.homeroomClass}`
                        : 'Wali Kelas'
                      : activeT.teacherType === 'guru_mapel'
                      ? `Guru Mapel: ${activeT.subject}`
                      : 'Admin Sekolah'}
                  </span>
                </span>
              </div>
            </div>

            {/* Authenticated Switch or Logout Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Ganti ke akun guru lain dengan memasukkan Email dan PIN"
                >
                  <i className="fa-solid fa-user-lock text-xs"></i>
                  <span>Ganti Akun</span>
                </button>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Keluar dari sesi akun saat ini"
                >
                  <i className="fa-solid fa-right-from-bracket text-xs"></i>
                  <span>Keluar</span>
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Date Picker and Cloud Persistence Toolbar */}
      <div className="bento-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Date Picker Section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-calendar-day"></i>
              </div>
              <div>
                <label htmlFor="scanner-date-picker" className="text-xs font-black text-slate-900 dark:text-white block">
                  Tanggal Presensi:
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {formatIndonesianDate(selectedDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="scanner-date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayISO())}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedDate === getTodayISO()
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getYesterdayISO())}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedDate === getYesterdayISO()
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Kemarin
              </button>
            </div>
          </div>

          {/* Cloud Persistence / Backup Safety Button */}
          {onManualSyncCloud && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={onManualSyncCloud}
                disabled={isSyncingCloud}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title="Simpan & pastikan semua data tersinkron ke Cloud Firestore sebelum membersihkan browser"
              >
                <i className={`fa-solid ${isSyncingCloud ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-xs`}></i>
                <span>{isSyncingCloud ? 'Menyimpan ke Cloud...' : 'Simpan Semua ke Cloud'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Warning if date is not today */}
        {selectedDate !== getTodayISO() && (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-200 font-medium">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm"></i>
              <span>
                <strong>Mode Tanggal Khusus Aktif:</strong> Scan kamera atau input NIS saat ini akan mencatat kehadiran untuk tanggal <strong>{formatIndonesianDate(selectedDate)}</strong>.
              </span>
            </div>
            <button
              onClick={() => setSelectedDate(getTodayISO())}
              className="text-xs font-bold text-amber-900 dark:text-amber-100 underline hover:no-underline cursor-pointer shrink-0 ml-2"
            >
              Kembalikan ke Hari Ini &rarr;
            </button>
          </div>
        )}

        {/* Browser Cache Safety Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
          <i className="fa-solid fa-shield-halved text-emerald-600 text-xs"></i>
          <span>
            <strong>Perlindungan Data Riwayat Browser:</strong> Setiap absensi otomatis tersimpan ke Cloud Firestore. Anda dapat mengklik tombol <em>"Simpan Semua ke Cloud"</em> sebelum membersihkan riwayat/cache browser agar 100% data tersinkron aman.
          </span>
        </div>
      </div>

      {/* Mode Presensi SMP Selector & Jam Pelajaran Toolbar */}
      <div className="bento-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold shadow-2xs">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Tipe Presensi SMP
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilih apakah absensi harian kedatangan gerbang sekolah atau absensi masuk per jam mata pelajaran
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setScanMode('harian')}
              disabled={isScanning || isLockedByTeacher}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isScanning || isLockedByTeacher ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              } ${
                activeScanMode === 'harian'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={
                isScanning
                  ? 'Terkunci saat kamera aktif memindai'
                  : isLockedByTeacher
                  ? `Akun Guru ${currentTeacher?.name} dikhususkan untuk presensi Mapel ${teacherMatchedSubject}`
                  : undefined
              }
            >
              <i className="fa-solid fa-door-open text-xs"></i>
              <span>Presensi Pagi / Gerbang</span>
            </button>
            <button
              type="button"
              onClick={() => setScanMode('mapel')}
              disabled={isScanning}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isScanning ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${
                activeScanMode === 'mapel'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isScanning ? 'Terkunci saat kamera aktif memindai' : undefined}
            >
              <i className="fa-solid fa-book-open-reader text-xs"></i>
              <span>Presensi Guru Mapel SMP</span>
              {isLockedByTeacher && (
                <i className="fa-solid fa-lock text-[10px] ml-0.5 text-emerald-200" title="Mapel terkunci sesuai akun guru"></i>
              )}
            </button>
          </div>
        </div>

        {/* Details when Mapel Mode is Selected */}
        {activeScanMode === 'mapel' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Jam Pelajaran Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Pilih Jam Pelajaran
                  </label>
                  {isScanning && (
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <i className="fa-solid fa-lock text-[8px]"></i> Terkunci
                    </span>
                  )}
                </div>
                <select
                  value={activePeriodId}
                  onChange={(e) => setActivePeriodId(e.target.value)}
                  disabled={isScanning}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isScanning
                      ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed opacity-90'
                      : 'bg-slate-50 dark:bg-slate-800 cursor-pointer'
                  }`}
                  title={isScanning ? 'Jam pelajaran terkunci selama kamera aktif memindai' : undefined}
                >
                  {periods.map((p) => {
                    const isNow = activeCurrentPeriod?.id === p.id;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.startTime} - {p.endTime}) {isNow ? '★ Jam Sekarang' : ''}
                      </option>
                    );
                  })}
                </select>
                {isScanning && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-lock text-[9px]"></i>
                    Terkunci saat kamera aktif
                  </p>
                )}
              </div>

              {/* Mata Pelajaran Selector with Automatic Locking */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>Mata Pelajaran</span>
                    {isSubjectLocked && (
                      <i className="fa-solid fa-lock text-emerald-600 dark:text-emerald-400 text-xs" title="Mata pelajaran terkunci"></i>
                    )}
                  </label>
                  {isSubjectLocked && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                      isLockedByTeacher
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      <i className="fa-solid fa-lock text-[8px]"></i>
                      {isLockedByTeacher ? 'Guru Mapel' : 'Kamera Aktif'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={activeSubject}
                    onChange={(e) => setActiveSubject(e.target.value)}
                    disabled={isSubjectLocked}
                    className={`w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isSubjectLocked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-extrabold cursor-not-allowed pr-8'
                        : 'bg-slate-50 dark:bg-slate-800 cursor-pointer'
                    }`}
                    title={
                      isLockedByTeacher
                        ? `Mata pelajaran otomatis terkunci ke "${activeSubject}" untuk akun Guru ${currentTeacher?.name}`
                        : isScanning
                        ? 'Mata pelajaran terkunci selama kamera pemindai QR aktif'
                        : undefined
                    }
                  >
                    {DEFAULT_SMP_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  {isSubjectLocked && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 dark:text-emerald-400">
                      <i className="fa-solid fa-lock text-xs"></i>
                    </div>
                  )}
                </div>

                {/* Sub-label explaining lock status */}
                {isLockedByTeacher ? (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-[9px] text-emerald-600 dark:text-emerald-400"></i>
                    Terkunci otomatis: <strong>{currentTeacher?.name}</strong> ({activeSubject})
                  </p>
                ) : isScanning ? (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-lock text-[9px]"></i>
                    Terkunci saat kamera aktif memindai
                  </p>
                ) : null}
              </div>

              {/* Kelas SMP Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Kelas Siswa
                  </label>
                  {isScanning && (
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <i className="fa-solid fa-lock text-[8px]"></i> Terkunci
                    </span>
                  )}
                </div>
                <select
                  value={activeClassRoom}
                  onChange={(e) => setActiveClassRoom(e.target.value)}
                  disabled={isScanning}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isScanning
                      ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed opacity-90'
                      : 'bg-slate-50 dark:bg-slate-800 cursor-pointer'
                  }`}
                  title={isScanning ? 'Pilihan kelas terkunci selama kamera aktif memindai' : undefined}
                >
                  {((settings.customClasses && settings.customClasses.length > 0)
                    ? settings.customClasses
                    : SMP_CLASSES
                  ).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                {isScanning && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-lock text-[9px]"></i>
                    Terkunci saat kamera aktif
                  </p>
                )}
              </div>

              {/* Actions: View Schedule & Quick Checklist */}
              <div className="flex items-end gap-2">
                {onOpenLessonSchedule && (
                  <button
                    type="button"
                    onClick={onOpenLessonSchedule}
                    className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    title="Buka jadwal mingguan jam pelajaran SMP"
                  >
                    <i className="fa-solid fa-calendar-days text-xs"></i>
                    <span>Jadwal Jam</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsQuickChecklistOpen((prev) => !prev)}
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
                    isQuickChecklistOpen
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  }`}
                  title="Buka daftar siswa kelas ini untuk centang manual / absen massal"
                >
                  <i className="fa-solid fa-list-check text-xs"></i>
                  <span>{isQuickChecklistOpen ? 'Tutup Daftar' : 'Daftar Kelas'}</span>
                </button>
              </div>
            </div>

            {/* Active Mode Notice Banner */}
            <div className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-medium transition-all ${
              isScanning
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                <span>
                  <strong>Mode Presensi Mapel Aktif:</strong> Setiap scan QR code atau input NIS saat ini akan otomatis mencatat presensi untuk mata pelajaran{' '}
                  <strong className="underline decoration-emerald-500 decoration-2">{activeSubject}</strong>{' '}
                  pada <strong>{periods.find((p) => p.id === activePeriodId)?.name || 'Jam Pelajaran'} ({periods.find((p) => p.id === activePeriodId)?.startTime} - {periods.find((p) => p.id === activePeriodId)?.endTime})</strong> untuk <strong>{activeClassRoom}</strong>.
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                {isLockedByTeacher && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[10px] flex items-center gap-1">
                    <i className="fa-solid fa-lock text-[9px]"></i> Terkunci ({activeSubject})
                  </span>
                )}
                {isScanning && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] flex items-center gap-1">
                    <i className="fa-solid fa-video text-[9px]"></i> Kamera Aktif
                  </span>
                )}
                {activeCurrentPeriod && activeCurrentPeriod.id === activePeriodId && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[10px]">
                    ★ Sesuai Jam Berjalan
                  </span>
                )}
              </div>
            </div>

            {/* Collapsible Quick Checklist for Active Class */}
            {isQuickChecklistOpen && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Daftar Kehadiran Siswa {activeClassRoom} — Mapel {activeSubject}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Klik tombol status untuk mencatat presensi langsung siswa per jam mapel tanpa scan kamera
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Cari siswa di kelas..."
                      value={quickChecklistSearch}
                      onChange={(e) => setQuickChecklistSearch(e.target.value)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const classStudents = students.filter((s) => s.classRoom === activeClassRoom);
                        const periodObj = periods.find((p) => p.id === activePeriodId);
                        let count = 0;
                        classStudents.forEach((std) => {
                          const hasRecord = attendanceRecords.some(
                            (r) =>
                              r.studentId === std.id &&
                              r.date === selectedDate &&
                              r.attendanceType === 'mapel' &&
                              (r.periodNumber === periodObj?.periodNumber || r.subject === activeSubject)
                          );
                          if (!hasRecord) {
                            onRecordAttendance(std, 'Manual Input', selectedDate, {
                              attendanceType: 'mapel',
                              periodNumber: periodObj?.periodNumber || 1,
                              periodName: periodObj
                                ? `${periodObj.name} (${periodObj.startTime} - ${periodObj.endTime})`
                                : 'Jam Mapel',
                              periodStartTime: periodObj?.startTime,
                              time: periodObj?.startTime || '08:00',
                              subject: activeSubject,
                              status: 'Hadir',
                              teacherName: currentTeacher?.name,
                              note: `Presensi Mapel ${activeSubject} - ${periodObj?.name || 'Jam Pelajaran'}`,
                            });
                            count++;
                          }
                        });
                        alert(`Berhasil menandai ${count} siswa ${activeClassRoom} sebagai Hadir di Mapel ${activeSubject}!`);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs shrink-0"
                      title="Tandai semua siswa yang belum absen di jam ini sebagai Hadir"
                    >
                      <i className="fa-solid fa-check-double text-xs"></i>
                      <span>Semua Hadir</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {students
                    .filter((s) => s.classRoom === activeClassRoom)
                    .filter((s) =>
                      quickChecklistSearch
                        ? s.name.toLowerCase().includes(quickChecklistSearch.toLowerCase()) ||
                          s.nis.includes(quickChecklistSearch)
                        : true
                    )
                    .map((std, idx) => {
                      const periodObj = periods.find((p) => p.id === activePeriodId);
                      const existingRecord = attendanceRecords.find(
                        (r) =>
                          r.studentId === std.id &&
                          r.date === selectedDate &&
                          r.attendanceType === 'mapel' &&
                          (r.periodNumber === periodObj?.periodNumber || r.subject === activeSubject)
                      );

                      return (
                        <div
                          key={std.id}
                          className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[10px] font-mono font-bold text-slate-400 w-5 text-center">
                              {idx + 1}
                            </span>
                            <img
                              src={std.photo || std.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                              alt={std.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                {std.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                NIS: {std.nis}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {existingRecord ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  existingRecord.status === 'Hadir'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                    : existingRecord.status === 'Terlambat'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                    : existingRecord.status === 'Sakit'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                                    : existingRecord.status === 'Izin'
                                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                }`}
                              >
                                {existingRecord.status} ({existingRecord.time})
                              </span>
                            ) : (
                              <div className="flex items-center gap-1">
                                {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as AttendanceStatus[]).map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                      const pObj = periods.find((p) => p.id === activePeriodId);
                                      onRecordAttendance(std, 'Manual Input', selectedDate, {
                                        attendanceType: 'mapel',
                                        periodNumber: pObj?.periodNumber || 1,
                                        periodName: pObj
                                          ? `${pObj.name} (${pObj.startTime} - ${pObj.endTime})`
                                          : 'Jam Mapel',
                                        periodStartTime: pObj?.startTime,
                                        time: pObj?.startTime || '08:00',
                                        subject: activeSubject,
                                        status: st,
                                        teacherName: currentTeacher?.name,
                                        note: `Presensi Mapel ${activeSubject} (${st})`,
                                      });
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                      st === 'Hadir'
                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                                        : st === 'Sakit'
                                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200'
                                        : st === 'Izin'
                                        ? 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white border border-sky-200'
                                        : 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 font-medium">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-indigo-600 text-sm"></i>
              <span>
                <strong>Mode Presensi Gerbang / Pagi Aktif:</strong> Mencatat absensi kedatangan harian siswa (Batas waktu terlambat: <strong>{settings.lateCutoffTime} WIB</strong>).
              </span>
            </div>
            <button
              type="button"
              onClick={() => setScanMode('mapel')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer transition-colors shrink-0 ml-2"
            >
              Ganti ke Presensi Mapel &rarr;
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interactive Scanner Area (2 Cols) */}
        <div className="lg:col-span-2 bento-card flex flex-col items-center">
          <div className="w-full max-w-md relative">
            {/* HTML5 QR Code Container Wrapper */}
            <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 min-h-[300px] flex items-center justify-center relative shadow-inner">
              {/* Dedicated empty DOM target for Html5Qrcode - React never places children inside this div */}
              <div id={scannerContainerId} className="w-full h-full min-h-[300px]" />

              {/* Active Scanner Lock HUD Overlay */}
              {isScanning && (
                <div className="absolute top-2.5 left-2.5 right-2.5 z-20 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/50 flex items-center justify-between text-xs text-white shadow-lg pointer-events-none">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] text-emerald-300 font-black tracking-wide">KAMERA SCANNER AKTIF</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-200">
                    <i className="fa-solid fa-lock text-emerald-400 text-[10px]"></i>
                    <span className="text-emerald-300 font-extrabold">{activeScanMode === 'mapel' ? activeSubject : 'Harian Pagi'}</span>
                    {activeScanMode === 'mapel' && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span>{activeClassRoom}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {!isScanning && permissionState !== 'denied' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-10 bg-slate-900/95 pointer-events-auto">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl border border-indigo-500/30">
                    <i className="fa-solid fa-qrcode"></i>
                  </div>
                  <h4 className="text-sm font-bold text-white">Kamera Siap Diaktifkan</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Klik tombol di bawah ini untuk memulai kamera webcam / HP Anda.
                  </p>
                  <button
                    onClick={startScanner}
                    disabled={isStartingCamera}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    <i className={`fa-solid ${isStartingCamera ? 'fa-spinner fa-spin' : 'fa-video'}`}></i>
                    <span>{isStartingCamera ? 'Memproses...' : 'Aktifkan Kamera Sekarang'}</span>
                  </button>
                </div>
              )}

              {/* Permission Denied UI Instruction Box */}
              {!isScanning && permissionState === 'denied' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-10 bg-slate-950/95 p-4 m-2 rounded-2xl border border-rose-500/40 pointer-events-auto">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl border border-rose-500/30 shadow-md">
                    <i className="fa-solid fa-video-slash"></i>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">Izin Kamera Ditolak / Diblokir</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Browser Anda memblokir akses ke kamera web. Untuk mengaktifkannya:
                  </p>
                  <ol className="text-[11px] text-slate-400 text-left max-w-xs mx-auto space-y-1 list-decimal pl-4 font-medium">
                    <li>Klik ikon <strong>gembok / camera</strong> di sebelah kiri URL browser.</li>
                    <li>Ubah setelan <strong>Camera</strong> menjadi <strong>Allow (Izinkan)</strong>.</li>
                    <li>Klik tombol di bawah untuk mencoba ulang.</li>
                  </ol>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={startScanner}
                      disabled={isStartingCamera}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      <i className="fa-solid fa-rotate-right"></i>
                      <span>Coba Ulang Kamera</span>
                    </button>

                    <a
                      href={typeof window !== 'undefined' ? window.location.href : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      <span>Buka di Tab Baru</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Error banner */}
            {scanError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 font-medium">
                <i className="fa-solid fa-circle-exclamation text-rose-600 text-sm mt-0.5"></i>
                <div className="flex-1">
                  <span>{scanError}</span>
                  {permissionState === 'denied' && (
                    <button
                      onClick={startScanner}
                      className="block mt-1 text-xs font-bold text-rose-800 underline hover:text-rose-950 cursor-pointer"
                    >
                      Coba Ulang Akses Kamera &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Option: Upload Image File QR */}
          <div className="mt-5 w-full max-w-md bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                <i className="fa-solid fa-file-image"></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Unggah Gambar QR / Kartu</h4>
                <p className="text-[10px] text-slate-500">Pindai dari foto galeri tanpa menggunakan kamera live</p>
              </div>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0">
              <i className={`fa-solid ${isProcessingFile ? 'fa-spinner fa-spin' : 'fa-upload'} text-xs`}></i>
              <span>{isProcessingFile ? 'Membaca...' : 'Pilih Foto'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleQRFileUpload}
                disabled={isProcessingFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick instructions */}
          <div className="mt-5 grid grid-cols-3 gap-3 w-full max-w-lg text-center text-xs text-slate-600">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <i className="fa-solid fa-bolt text-amber-600 text-sm mb-1 block"></i>
              <span className="font-semibold">Auto Focus QR</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <i className="fa-solid fa-bell text-emerald-600 text-sm mb-1 block"></i>
              <span className="font-semibold">Audio Beep</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <i className="fa-solid fa-shield-halved text-indigo-600 text-sm mb-1 block"></i>
              <span className="font-semibold">Anti Duplikasi</span>
            </div>
          </div>
        </div>

        {/* Alternative Manual NIS/QR Tester Box (1 Col) */}
        <div className="space-y-6">
          <div className="bento-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-keyboard"></i>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Input NIS Manual (Tanpa Kamera)</h3>
                <p className="text-[11px] text-slate-500">Ketik NIS siswa untuk mencatat absensi</p>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Input Nomor Induk Siswa (NIS)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: 1001"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Proses
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 italic">
                * Alternatif cepat jika webcam laptop/HP tidak tersedia.
              </p>
            </form>

            {/* List of sample NIS for fast testing */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                Pilih NIS Siswa SMP Siap Diuji:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {students.slice(0, 6).map((std) => (
                  <button
                    key={std.id}
                    onClick={() => {
                      setManualInput(std.nis);
                      processPayload(std.nis, 'Manual Input');
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <span>{std.nis}</span>
                    <span className="text-[9px] text-slate-400 font-normal">({std.name.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Scan Feedback Popup Modal */}
      {lastScanResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center space-y-4 animate-scale-up">
            <button
              onClick={() => setLastScanResult(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            {/* Header Status Badge */}
            <div>
              {lastScanResult.isDuplicate ? (
                <span className="status-badge status-late">
                  <i className="fa-solid fa-triangle-exclamation"></i> SUDAH ABSEN PADA TANGGAL {lastScanResult.record.date}
                </span>
              ) : lastScanResult.record.status === 'Hadir' ? (
                <span className="status-badge status-present">
                  <i className="fa-solid fa-circle-check"></i> HADIR TEPAT WAKTU
                </span>
              ) : (
                <span className="status-badge status-late">
                  <i className="fa-solid fa-clock"></i> TERLAMBAT
                </span>
              )}
            </div>

            {/* Student Card Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <img
                src={lastScanResult.student.photo || lastScanResult.student.avatarUrl}
                alt={lastScanResult.student.name}
                className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-indigo-500/20 shadow-md bg-slate-200"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900">{lastScanResult.student.name}</h3>
                <p className="text-xs text-slate-500 font-mono font-semibold">
                  NIS: {lastScanResult.student.nis} • {lastScanResult.student.classRoom}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl text-left text-xs border border-slate-200 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Tanggal Presensi</span>
                  <span className="font-mono font-extrabold text-indigo-600">
                    {lastScanResult.record.date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Jam Masuk</span>
                  <span className="font-mono font-extrabold text-emerald-600">
                    {lastScanResult.record.time} WIB
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Metode Scan</span>
                  <span className="font-semibold text-slate-700">
                    {lastScanResult.record.scannedVia}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Petugas Absen</span>
                  <span className="font-semibold text-slate-700 truncate block">
                    {lastScanResult.record.teacherName || 'Guru Petugas'}
                  </span>
                </div>

                {lastScanResult.record.attendanceType === 'mapel' && (
                  <div className="col-span-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-left">
                    <span className="text-[10px] text-emerald-600 font-bold block uppercase tracking-wider">
                      Presensi Mata Pelajaran SMP
                    </span>
                    <div className="text-xs font-black text-emerald-900 flex items-center justify-between">
                      <span>Mapel: {lastScanResult.record.subject}</span>
                      <span>{lastScanResult.record.periodName || `Jam ke-${lastScanResult.record.periodNumber}`}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 py-1.5 px-2.5 rounded-lg border border-emerald-100">
                <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
                <span>Tersimpan aman di Cloud Firestore</span>
              </div>

              {/* WhatsApp Notification Action Box */}
              <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                <button
                  onClick={() =>
                    openWhatsAppNotification(
                      lastScanResult.student,
                      lastScanResult.record,
                      settings.schoolName
                    )
                  }
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Kirim WA Notifikasi ke Orang Tua</span>
                </button>

                <button
                  onClick={async () => {
                    const ok = await copyWAMessageToClipboard(
                      lastScanResult.student,
                      lastScanResult.record,
                      settings.schoolName
                    );
                    if (ok) {
                      alert('Pesan WA berhasil disalin ke clipboard!');
                    }
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  <i className="fa-regular fa-copy mr-1"></i>
                  Salin Teks Pesan WA
                </button>
              </div>
            </div>

            <button
              onClick={() => setLastScanResult(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Lanjutkan Pemindaian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
