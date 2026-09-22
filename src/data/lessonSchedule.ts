import { LessonPeriod, SubjectScheduleItem } from '../types';

export const DEFAULT_LESSON_PERIODS: LessonPeriod[] = [
  {
    id: 'p-1',
    periodNumber: 1,
    name: 'Jam Ke-1',
    startTime: '07:15',
    endTime: '08:00',
    isBreak: false,
  },
  {
    id: 'p-2',
    periodNumber: 2,
    name: 'Jam Ke-2',
    startTime: '08:00',
    endTime: '08:45',
    isBreak: false,
  },
  {
    id: 'p-3',
    periodNumber: 3,
    name: 'Jam Ke-3',
    startTime: '08:45',
    endTime: '09:30',
    isBreak: false,
  },
  {
    id: 'p-break-1',
    periodNumber: 0,
    name: 'Istirahat Pagi',
    startTime: '09:30',
    endTime: '09:50',
    isBreak: true,
  },
  {
    id: 'p-4',
    periodNumber: 4,
    name: 'Jam Ke-4',
    startTime: '09:50',
    endTime: '10:35',
    isBreak: false,
  },
  {
    id: 'p-5',
    periodNumber: 5,
    name: 'Jam Ke-5',
    startTime: '10:35',
    endTime: '11:20',
    isBreak: false,
  },
  {
    id: 'p-6',
    periodNumber: 6,
    name: 'Jam Ke-6',
    startTime: '11:20',
    endTime: '12:05',
    isBreak: false,
  },
  {
    id: 'p-break-2',
    periodNumber: 0,
    name: 'Istirahat & Sholat',
    startTime: '12:05',
    endTime: '12:45',
    isBreak: true,
  },
  {
    id: 'p-7',
    periodNumber: 7,
    name: 'Jam Ke-7',
    startTime: '12:45',
    endTime: '13:30',
    isBreak: false,
  },
  {
    id: 'p-8',
    periodNumber: 8,
    name: 'Jam Ke-8',
    startTime: '13:30',
    endTime: '14:15',
    isBreak: false,
  },
];

export const DEFAULT_SMP_SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'Ilmu Pengetahuan Alam (IPA)',
  'Bahasa Inggris',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Pendidikan Agama Islam (PAI)',
  'Pendidikan Pancasila (PPKn)',
  'PJOK (Penjasorkes)',
  'Informatika',
  'Seni Budaya',
  'Prakarya',
];

export const DEFAULT_WEEKLY_SCHEDULE: SubjectScheduleItem[] = [
  // SENIN
  {
    id: 'sch-senin-7a-1',
    day: 'Senin',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7A',
    subject: 'Matematika',
    teacherName: 'HENDRA WIJAYA, S.Pd.',
  },
  {
    id: 'sch-senin-7a-2',
    day: 'Senin',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7A',
    subject: 'Matematika',
    teacherName: 'HENDRA WIJAYA, S.Pd.',
  },
  {
    id: 'sch-senin-7a-3',
    day: 'Senin',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 7A',
    subject: 'Bahasa Indonesia',
    teacherName: 'SITI RAHMAWATI, S.Pd.',
  },
  {
    id: 'sch-senin-7a-4',
    day: 'Senin',
    periodId: 'p-4',
    periodNumber: 4,
    periodName: 'Jam Ke-4 (09:50 - 10:35)',
    classRoom: 'Kelas 7A',
    subject: 'Bahasa Indonesia',
    teacherName: 'SITI RAHMAWATI, S.Pd.',
  },
  {
    id: 'sch-senin-7a-5',
    day: 'Senin',
    periodId: 'p-5',
    periodNumber: 5,
    periodName: 'Jam Ke-5 (10:35 - 11:20)',
    classRoom: 'Kelas 7A',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    teacherName: 'AHMAD FAUZI, S.Pd.',
  },
  {
    id: 'sch-senin-7a-6',
    day: 'Senin',
    periodId: 'p-6',
    periodNumber: 6,
    periodName: 'Jam Ke-6 (11:20 - 12:05)',
    classRoom: 'Kelas 7A',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    teacherName: 'AHMAD FAUZI, S.Pd.',
  },

  // SENIN - Kelas 7B
  {
    id: 'sch-senin-7b-1',
    day: 'Senin',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7B',
    subject: 'Bahasa Inggris',
    teacherName: 'NUR INDAH, S.Pd.',
  },
  {
    id: 'sch-senin-7b-2',
    day: 'Senin',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7B',
    subject: 'Bahasa Inggris',
    teacherName: 'NUR INDAH, S.Pd.',
  },
  {
    id: 'sch-senin-7b-3',
    day: 'Senin',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 7B',
    subject: 'Matematika',
    teacherName: 'HENDRA WIJAYA, S.Pd.',
  },
  {
    id: 'sch-senin-7b-4',
    day: 'Senin',
    periodId: 'p-4',
    periodNumber: 4,
    periodName: 'Jam Ke-4 (09:50 - 10:35)',
    classRoom: 'Kelas 7B',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    teacherName: 'DEDI KURNIAWAN, S.Pd.',
  },

  // SENIN - Kelas 8A
  {
    id: 'sch-senin-8a-1',
    day: 'Senin',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 8A',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    teacherName: 'AHMAD FAUZI, S.Pd.',
  },
  {
    id: 'sch-senin-8a-2',
    day: 'Senin',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 8A',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    teacherName: 'AHMAD FAUZI, S.Pd.',
  },
  {
    id: 'sch-senin-8a-3',
    day: 'Senin',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 8A',
    subject: 'Pendidikan Pancasila (PPKn)',
    teacherName: 'SRI WAHYUNI, S.Pd.',
  },

  // SENIN - Kelas 8B
  {
    id: 'sch-senin-8b-1',
    day: 'Senin',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 8B',
    subject: 'Pendidikan Agama Islam (PAI)',
    teacherName: 'UST. M. YUSUF, S.Pd.I.',
  },
  {
    id: 'sch-senin-8b-2',
    day: 'Senin',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 8B',
    subject: 'Pendidikan Agama Islam (PAI)',
    teacherName: 'UST. M. YUSUF, S.Pd.I.',
  },
  {
    id: 'sch-senin-8b-3',
    day: 'Senin',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 8B',
    subject: 'Informatika',
    teacherName: 'MEGAWATI, S.Kom.',
  },

  // SENIN - Kelas 9A
  {
    id: 'sch-senin-9a-1',
    day: 'Senin',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 9A',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    teacherName: 'DEDI KURNIAWAN, S.Pd.',
  },
  {
    id: 'sch-senin-9a-2',
    day: 'Senin',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 9A',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    teacherName: 'DEDI KURNIAWAN, S.Pd.',
  },
  {
    id: 'sch-senin-9a-3',
    day: 'Senin',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 9A',
    subject: 'PJOK (Penjasorkes)',
    teacherName: 'BAMBANG PRASETYO, S.Pd.',
  },

  // SENIN - Kelas 9B
  {
    id: 'sch-senin-9b-1',
    day: 'Senin',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 9B',
    subject: 'Seni Budaya',
    teacherName: 'DEWI LESTARI, S.Pd.',
  },
  {
    id: 'sch-senin-9b-2',
    day: 'Senin',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 9B',
    subject: 'Bahasa Indonesia',
    teacherName: 'SITI RAHMAWATI, S.Pd.',
  },
  {
    id: 'sch-senin-9b-3',
    day: 'Senin',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 9B',
    subject: 'Matematika',
    teacherName: 'HENDRA WIJAYA, S.Pd.',
  },

  // SELASA
  {
    id: 'sch-selasa-7a-1',
    day: 'Selasa',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7A',
    subject: 'PJOK (Penjasorkes)',
    teacherName: 'BAMBANG PRASETYO, S.Pd.',
  },
  {
    id: 'sch-selasa-7a-2',
    day: 'Selasa',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7A',
    subject: 'PJOK (Penjasorkes)',
    teacherName: 'BAMBANG PRASETYO, S.Pd.',
  },
  {
    id: 'sch-selasa-7a-3',
    day: 'Selasa',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 7A',
    subject: 'Informatika',
    teacherName: 'MEGAWATI, S.Kom.',
  },
  {
    id: 'sch-selasa-7b-1',
    day: 'Selasa',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7B',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    teacherName: 'AHMAD FAUZI, S.Pd.',
  },
  {
    id: 'sch-selasa-8a-1',
    day: 'Selasa',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 8A',
    subject: 'Matematika',
    teacherName: 'HENDRA WIJAYA, S.Pd.',
  },
  {
    id: 'sch-selasa-9a-1',
    day: 'Selasa',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 9A',
    subject: 'Bahasa Inggris',
    teacherName: 'NUR INDAH, S.Pd.',
  },

  // RABU
  {
    id: 'sch-rabu-7a-1',
    day: 'Rabu',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7A',
    subject: 'Pendidikan Agama Islam (PAI)',
    teacherName: 'UST. M. YUSUF, S.Pd.I.',
  },
  {
    id: 'sch-rabu-7a-2',
    day: 'Rabu',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7A',
    subject: 'Pendidikan Agama Islam (PAI)',
    teacherName: 'UST. M. YUSUF, S.Pd.I.',
  },
  {
    id: 'sch-rabu-7a-3',
    day: 'Rabu',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 7A',
    subject: 'Pendidikan Pancasila (PPKn)',
    teacherName: 'SRI WAHYUNI, S.Pd.',
  },

  // KAMIS
  {
    id: 'sch-kamis-7a-1',
    day: 'Kamis',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7A',
    subject: 'Bahasa Inggris',
    teacherName: 'NUR INDAH, S.Pd.',
  },
  {
    id: 'sch-kamis-7a-2',
    day: 'Kamis',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7A',
    subject: 'Bahasa Inggris',
    teacherName: 'NUR INDAH, S.Pd.',
  },
  {
    id: 'sch-kamis-7a-3',
    day: 'Kamis',
    periodId: 'p-3',
    periodNumber: 3,
    periodName: 'Jam Ke-3 (08:45 - 09:30)',
    classRoom: 'Kelas 7A',
    subject: 'Seni Budaya',
    teacherName: 'DEWI LESTARI, S.Pd.',
  },

  // JUMAT
  {
    id: 'sch-jumat-7a-1',
    day: 'Jumat',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7A',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    teacherName: 'DEDI KURNIAWAN, S.Pd.',
  },
  {
    id: 'sch-jumat-7a-2',
    day: 'Jumat',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7A',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    teacherName: 'DEDI KURNIAWAN, S.Pd.',
  },

  // SABTU
  {
    id: 'sch-sabtu-7a-1',
    day: 'Sabtu',
    periodId: 'p-1',
    periodNumber: 1,
    periodName: 'Jam Ke-1 (07:15 - 08:00)',
    classRoom: 'Kelas 7A',
    subject: 'Prakarya',
    teacherName: 'MEGAWATI, S.Kom.',
  },
  {
    id: 'sch-sabtu-7a-2',
    day: 'Sabtu',
    periodId: 'p-2',
    periodNumber: 2,
    periodName: 'Jam Ke-2 (08:00 - 08:45)',
    classRoom: 'Kelas 7A',
    subject: 'Prakarya',
    teacherName: 'MEGAWATI, S.Kom.',
  },
];

/**
 * Returns current period matching current HH:mm time
 */
export function getCurrentLessonPeriod(
  timeStr?: string,
  periods: LessonPeriod[] = DEFAULT_LESSON_PERIODS
): LessonPeriod | null {
  let timeToCompare = timeStr;
  if (!timeToCompare) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    timeToCompare = `${h}:${m}`;
  }

  const [currH, currM] = timeToCompare.split(':').map(Number);
  const currTotalMin = currH * 60 + currM;

  for (const p of periods) {
    const [startH, startM] = p.startTime.split(':').map(Number);
    const [endH, endM] = p.endTime.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    if (currTotalMin >= startMin && currTotalMin < endMin) {
      return p;
    }
  }

  // If outside regular period, return the closest regular teaching period (default Jam Ke-1)
  return null;
}

/**
 * Gets Indonesian day of week name from Date or string
 */
export function getIndonesianDayName(date?: Date | string): 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' {
  const d = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();
  const days: ('Minggu' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu')[] = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  const dayName = days[d.getDay()];
  if (dayName === 'Minggu') return 'Senin'; // fallback
  return dayName as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
}

/**
 * Match a teacher's subject field with standard SMP subject list
 */
export function matchTeacherSubject(teacherSubject?: string): string | null {
  if (!teacherSubject) return null;
  const s = teacherSubject.trim().toLowerCase();

  // Check exact match first
  for (const subj of DEFAULT_SMP_SUBJECTS) {
    if (subj.toLowerCase() === s) return subj;
  }

  // Normalized substring and acronym matches
  if (s.includes('indonesia')) return 'Bahasa Indonesia';
  if (s.includes('inggris')) return 'Bahasa Inggris';
  if (s.includes('matematika') || s.includes('mtk')) return 'Matematika';
  if (s.includes('ipa') || s.includes('alam')) return 'Ilmu Pengetahuan Alam (IPA)';
  if (s.includes('ips') || s.includes('sosial')) return 'Ilmu Pengetahuan Sosial (IPS)';
  if (s.includes('agama') || s.includes('pai') || s.includes('islam')) return 'Pendidikan Agama Islam (PAI)';
  if (s.includes('pancasila') || s.includes('pkn') || s.includes('ppkn')) return 'Pendidikan Pancasila (PPKn)';
  if (s.includes('pjok') || s.includes('penjas') || s.includes('olahraga')) return 'PJOK (Penjasorkes)';
  if (s.includes('informatika') || s.includes('tik') || s.includes('komputer')) return 'Informatika';
  if (s.includes('seni') || s.includes('budaya') || s.includes('rupa') || s.includes('musik')) return 'Seni Budaya';
  if (s.includes('prakarya')) return 'Prakarya';

  return null;
}

