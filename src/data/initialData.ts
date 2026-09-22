import { Student, AttendanceRecord, SystemSettings, Teacher, School } from '../types';
import { MALE_BW_AVATAR, FEMALE_BW_AVATAR } from '../utils/avatars';

export const DEFAULT_PRIMARY_SCHOOL_ID = 'smp-satap-4-palasa';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'smp-satap-4-palasa',
    code: 'SMP4PLS',
    name: 'SMP NEGERI SATAP 4 PALASA',
    nss: '201180816004',
    npsn: '69947184',
    address: 'Desa Ulatan, Kec. Palasa, Kab. Parigi Moutong, Sulawesi Tengah',
    city: 'Parigi Moutong',
    academicYear: '2025/2026',
    lateCutoffTime: '07:15',
    headmasterName: 'RAHMAT, S.Pd., M.Pd',
    headmasterNip: '19851204 200903 1 002',
    headmasterCount: 1,
    teacherCount: 12,
    staffCount: 2,
    contactEmail: 'Fadli46046@gmail.com',
    contactPhone: '081234567890',
    isActive: true,
    createdAt: '2025-01-01',
    notes: 'SMP Negeri Satu Atap 4 Palasa',
  },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  schoolId: DEFAULT_PRIMARY_SCHOOL_ID,
  lateCutoffTime: '07:15',
  schoolName: 'SMP NEGERI SATAP 4 PALASA',
  nss: '201180816004',
  npsn: '69947184',
  schoolAddress: 'Desa Ulatan, Kec. Palasa, Kab. Parigi Moutong, Sulawesi Tengah',
  academicYear: '2025/2026',
  headmasterName: 'RAHMAT, S.Pd., M.Pd',
  headmasterNip: '19851204 200903 1 002',
  headmasterCount: 1,
  teacherCount: 12,
  staffCount: 2,
  schoolCity: 'Parigi Moutong',
  schoolRegency: 'PEMERINTAH KABUPATEN PARIGI MOUTONG',
  schoolDepartment: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  cardTitle: 'KARTU TANDA SISWA & PRESENSI DIGITAL',
  cardValidityText: 'KARTU RESMI PELAJAR • BERLAKU SELAMA MENJADI SISWA',
  notifications: [],
  customClasses: ['Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B', 'Kelas 9A', 'Kelas 9B'],
};

export const SMP_CLASSES = [
  'Kelas 7A',
  'Kelas 7B',
  'Kelas 8A',
  'Kelas 8B',
  'Kelas 9A',
  'Kelas 9B',
];

// Alias for backwards compatibility
export const SD_CLASSES = SMP_CLASSES;

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-admin',
    name: 'MOH. FADLI',
    nip: '199903202025211020',
    nuptk: '6342 7776 7813 0012',
    pangkatGol: 'VII / Penata Muda',
    address: 'Desa Ulatan, Kec. Palasa',
    distanceFromSchool: '200 M',
    employmentStatus: 'PPPK',
    email: 'Fadli46046@gmail.com',
    pin: 'Hanin231221',
    subject: 'Operator / Tenaga Administrasi Sekolah',
    role: 'admin',
    teacherType: 'admin',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-hendra',
    name: 'HENDRA WIJAYA, S.Pd.',
    nip: '19880415 201101 1 008',
    nuptk: '7451 7666 6720 0011',
    pangkatGol: 'Penata Tkt.I, III/d',
    address: 'Palasa Lambori',
    distanceFromSchool: '1.200 M',
    employmentStatus: 'PNS',
    email: 'hendra.wijaya@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Matematika',
    role: 'guru',
    teacherType: 'wali_kelas',
    homeroomClass: 'Kelas 7A',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-siti',
    name: 'SITI RAHMAWATI, S.Pd.',
    nip: '19900822 201503 2 004',
    nuptk: '5142 7686 6921 0032',
    pangkatGol: 'Penata Muda Tkt.I, III/b',
    address: 'Desa Palasa Tengah',
    distanceFromSchool: '800 M',
    employmentStatus: 'PNS',
    email: 'siti.rahma@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Bahasa Indonesia',
    role: 'guru',
    teacherType: 'wali_kelas',
    homeroomClass: 'Kelas 7B',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-fauzi',
    name: 'AHMAD FAUZI, S.Pd.',
    nip: '19870310 201001 1 006',
    nuptk: '4333 7656 6620 0024',
    pangkatGol: 'Penata, III/c',
    address: 'Ulatan Bawah',
    distanceFromSchool: '500 M',
    employmentStatus: 'PNS',
    email: 'ahmad.fauzi@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    role: 'guru',
    teacherType: 'wali_kelas',
    homeroomClass: 'Kelas 8A',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-indah',
    name: 'NUR INDAH, S.Pd.',
    nip: '19930514 201902 2 007',
    nuptk: '8245 7716 7223 0015',
    pangkatGol: 'Penata Muda, III/a',
    address: 'Desa Palasa Lambori',
    distanceFromSchool: '1.500 M',
    employmentStatus: 'PPPK',
    email: 'nur.indah@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Bahasa Inggris',
    role: 'guru',
    teacherType: 'wali_kelas',
    homeroomClass: 'Kelas 8B',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-dedi',
    name: 'DEDI KURNIAWAN, S.Pd.',
    nip: '19861118 200903 1 003',
    nuptk: '3542 7646 6520 0019',
    pangkatGol: 'Penata Tkt.I, III/d',
    address: 'Ulatan Dusun 2',
    distanceFromSchool: '400 M',
    employmentStatus: 'PNS',
    email: 'dedi.kurniawan@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    role: 'guru',
    teacherType: 'wali_kelas',
    homeroomClass: 'Kelas 9A',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-sri',
    name: 'SRI WAHYUNI, S.Pd.',
    nip: '19910212 201704 2 002',
    nuptk: '6444 7696 7022 0018',
    pangkatGol: 'Penata Muda Tkt.I, III/b',
    address: 'Desa Ulatan',
    distanceFromSchool: '300 M',
    employmentStatus: 'PNS',
    email: 'sri.wahyuni@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Pendidikan Pancasila (PPKn)',
    role: 'guru',
    teacherType: 'wali_kelas',
    homeroomClass: 'Kelas 9B',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-yusuf',
    name: 'UST. M. YUSUF, S.Pd.I.',
    nip: '19840618 200801 1 005',
    nuptk: '2136 7626 6420 0013',
    pangkatGol: 'Pembina, IV/a',
    address: 'Palasa Tengah',
    distanceFromSchool: '1.000 M',
    employmentStatus: 'PNS',
    email: 'm.yusuf@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Pendidikan Agama Islam (PAI)',
    role: 'guru',
    teacherType: 'guru_mapel',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-bambang',
    name: 'BAMBANG PRASETYO, S.Pd.',
    nip: '19920704 201802 1 004',
    nuptk: '7344 7706 7120 0022',
    pangkatGol: 'Penata Muda, III/a',
    address: 'Desa Palasa Lambori',
    distanceFromSchool: '2.000 M',
    employmentStatus: 'PPPK',
    email: 'bambang.prasetyo@smp4palasa.sch.id',
    pin: '123456',
    subject: 'PJOK (Penjasorkes)',
    role: 'guru',
    teacherType: 'guru_mapel',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-megawati',
    name: 'MEGAWATI, S.Kom.',
    nip: '19951016 202102 2 009',
    nuptk: '9246 7736 7421 0017',
    pangkatGol: 'IX / PPPK',
    address: 'Desa Ulatan',
    distanceFromSchool: '350 M',
    employmentStatus: 'PPPK',
    email: 'megawati@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Informatika & Prakarya',
    role: 'guru',
    teacherType: 'guru_mapel',
    inTime: '7.15',
    outTime: '14.15',
  },
  {
    id: 'tch-dewi',
    name: 'DEWI LESTARI, S.Pd.',
    nip: '19940120 202003 2 005',
    nuptk: '8541 7726 7322 0025',
    pangkatGol: 'Penata Muda, III/a',
    address: 'Palasa Lambori',
    distanceFromSchool: '1.400 M',
    employmentStatus: 'Honorer',
    email: 'dewi.lestari@smp4palasa.sch.id',
    pin: '123456',
    subject: 'Seni Budaya',
    role: 'guru',
    teacherType: 'guru_mapel',
    inTime: '7.15',
    outTime: '14.15',
  },
];

export const SAMPLE_TEACHER_IDS = INITIAL_TEACHERS.map((t) => t.id);

export const DUMMY_STUDENT_IDS = new Set<string>([
  'std-7a-01', 'std-7a-02', 'std-7a-03', 'std-7a-04',
  'std-7b-01', 'std-7b-02', 'std-7b-03',
  'std-8a-01', 'std-8a-02', 'std-8a-03',
  'std-8b-01', 'std-8b-02',
  'std-9a-01', 'std-9a-02',
  'std-9b-01', 'std-9b-02',
  'std-1001', 'std-1002', 'std-1003', 'std-1004', 'std-1005', 'std-1006', 'std-1007',
  'std-1008', 'std-1009', 'std-1010', 'std-1011', 'std-1012', 'std-1013', 'std-1014',
]);

export const DUMMY_STUDENT_NISNS = new Set<string>([
  '0105432101', '0105432102', '0105432103', '0105432104', '0105432105', '0105432106', '0105432107',
  '0115432201', '0115432202', '0115432203', '0115432204', '0115432205',
  '0125432301', '0125432302', '0125432303', '0125432304',
  '0012345678', '0012345679', '0012345680', '0012345681', '0012345682', '0012345683', '0012345684',
  '0012345685', '0012345686', '0012345687', '0012345688', '0012345689', '0012345690', '0012345691',
]);

export const DUMMY_STUDENT_NAMES = new Set<string>([
  'ADITYA PRATAMA',
  'AULIA NUR AZIZAH',
  'BAGAS WIRATAMA',
  'CINTA ANGGRAENI',
  'DIMAS ARYA KUSUMA',
  'FATIMAH AZ-ZAHRA',
  'GILANG RAMADHAN',
  'HAFIDZ FADLILLAH',
  'INDRIANI SAPUTRI',
  'JOKO SAMUDRA',
  'KHAIRUNNISA PUTRI',
  'LUTHFI AL-HAKIM',
  'MUHAMMAD RIZKY MAULANA',
  'NURUL HIDAYAH',
  'REZA PAHLEVI',
  'SALSABILA NADIA',
  'AHMAD FAUZI',
  'SITI NURHALIZA',
  'BUDI SANTOSO',
  'DEWI LESTARI',
  'EKO PRASETYO',
  'FITRI HANDAYANI',
  'GALIH PERMANA',
  'HANIFAH PUTRI',
  'ILHAM RAMADHAN',
  'JASMINE AQILA',
  'KEVIN PRATAMA',
  'LIDYA SAFITRI',
  'MUHAMMAD RIZKI',
  'NADIA UTAMI',
]);

/**
 * Checks if a student record is a mock/dummy sample student
 */
export const isDummyStudent = (s: Partial<Student> | null | undefined): boolean => {
  if (!s) return false;
  if (s.id && DUMMY_STUDENT_IDS.has(s.id)) return true;
  if (s.id && (
    s.id.startsWith('std-7a-') ||
    s.id.startsWith('std-7b-') ||
    s.id.startsWith('std-8a-') ||
    s.id.startsWith('std-8b-') ||
    s.id.startsWith('std-9a-') ||
    s.id.startsWith('std-9b-') ||
    (s.id.startsWith('std-10') && s.id.length <= 8)
  )) return true;
  if (s.nisn && DUMMY_STUDENT_NISNS.has(s.nisn.trim())) return true;
  if (s.name && DUMMY_STUDENT_NAMES.has(s.name.trim().toUpperCase())) return true;
  return false;
};

/**
 * Checks if an attendance record belongs to a dummy student
 */
export const isDummyAttendance = (r: Partial<AttendanceRecord> | null | undefined): boolean => {
  if (!r) return true;
  if (r.studentId && DUMMY_STUDENT_IDS.has(r.studentId)) return true;
  if (
    r.studentId && (
      r.studentId.startsWith('std-7a-') ||
      r.studentId.startsWith('std-7b-') ||
      r.studentId.startsWith('std-8a-') ||
      r.studentId.startsWith('std-8b-') ||
      r.studentId.startsWith('std-9a-') ||
      r.studentId.startsWith('std-9b-') ||
      (r.studentId.startsWith('std-10') && r.studentId.length <= 8)
    )
  ) return true;
  if (r.studentName && DUMMY_STUDENT_NAMES.has(r.studentName.trim().toUpperCase())) return true;
  return false;
};

// INITIAL_STUDENTS is set to empty to preserve ONLY user-uploaded data
export const INITIAL_STUDENTS: Student[] = [];

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const generateInitialAttendance = (_todayStr: string): AttendanceRecord[] => {
  return [];
};
