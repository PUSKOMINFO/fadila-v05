// Mock data for SMAN 1 Mayong Jepara Attendance System

export interface User {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: 'siswa' | 'guru';
  kelas?: string;
  nis?: string;
  nip?: string;
  mapel?: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  tanggal: string;
  waktuMasuk?: string;
  waktuKeluar?: string;
  status: 'hadir' | 'terlambat' | 'tidak_hadir' | 'izin' | 'sakit';
  keterangan?: string;
}

export interface Schedule {
  id: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mapel: string;
  guru: string;
  kelas: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'STU001',
    nama: 'Fadhila Asla Shana',
    email: 'fadhila@siswa.sman1mayong.sch.id',
    password: 'siswa123',
    role: 'siswa',
    kelas: 'Kelas 10A',
    nis: 'STU001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fadhila&backgroundColor=c0aede'
  },
  {
    id: 'STU002',
    nama: 'Rizki Pratama',
    email: 'rizki@siswa.sman1mayong.sch.id',
    password: 'siswa123',
    role: 'siswa',
    kelas: 'Kelas 10A',
    nis: 'STU002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizki&backgroundColor=b6e3f4'
  },
  {
    id: 'STU003',
    nama: 'Sari Indah',
    email: 'sari@siswa.sman1mayong.sch.id',
    password: 'siswa123',
    role: 'siswa',
    kelas: 'Kelas 10A',
    nis: 'STU003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sari&backgroundColor=ffd5dc'
  },
  {
    id: 'STU004',
    nama: 'Ahmad Fauzi',
    email: 'ahmad@siswa.sman1mayong.sch.id',
    password: 'siswa123',
    role: 'siswa',
    kelas: 'Kelas 10A',
    nis: 'STU004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad&backgroundColor=c0aede'
  },
  {
    id: 'STU005',
    nama: 'Maya Sinta',
    email: 'maya@siswa.sman1mayong.sch.id',
    password: 'siswa123',
    role: 'siswa',
    kelas: 'Kelas 10A',
    nis: 'STU005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya&backgroundColor=ffdfbf'
  },
  {
    id: 'TEA001',
    nama: 'Ibu Sari Wulandari',
    email: 'sari.wulandari@guru.sman1mayong.sch.id',
    password: 'guru123',
    role: 'guru',
    nip: 'TEA001',
    mapel: 'Matematika',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sariwulandari&backgroundColor=c0aede'
  },
  {
    id: 'TEA002',
    nama: 'Bapak Andi Susanto',
    email: 'andi.susanto@guru.sman1mayong.sch.id',
    password: 'guru123',
    role: 'guru',
    nip: 'TEA002',
    mapel: 'Bahasa Indonesia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=andi&backgroundColor=b6e3f4'
  }
];

// Mock Attendance Records for today
const today = new Date().toISOString().split('T')[0];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'ATT001', userId: 'STU001', tanggal: today, waktuMasuk: '08:15', status: 'hadir' },
  { id: 'ATT002', userId: 'STU002', tanggal: today, waktuMasuk: '08:22', status: 'hadir' },
  { id: 'ATT003', userId: 'STU003', tanggal: today, status: 'tidak_hadir', keterangan: 'Tanpa keterangan' },
  { id: 'ATT004', userId: 'STU004', tanggal: today, waktuMasuk: '08:10', status: 'hadir' },
  { id: 'ATT005', userId: 'STU005', tanggal: today, waktuMasuk: '08:45', status: 'terlambat' },
];

// Mock Schedules
export const mockSchedules: Schedule[] = [
  { id: 'SCH001', hari: 'Senin', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Matematika', guru: 'Ibu Sari Wulandari', kelas: 'Kelas 10A' },
  { id: 'SCH002', hari: 'Senin', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Bahasa Indonesia', guru: 'Bapak Andi Susanto', kelas: 'Kelas 10A' },
  { id: 'SCH003', hari: 'Selasa', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Fisika', guru: 'Bapak Joko', kelas: 'Kelas 10A' },
  { id: 'SCH004', hari: 'Selasa', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Kimia', guru: 'Ibu Dewi', kelas: 'Kelas 10A' },
  { id: 'SCH005', hari: 'Rabu', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Biologi', guru: 'Ibu Ani', kelas: 'Kelas 10A' },
];

// Initialize localStorage with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify(mockAttendance));
  }
  if (!localStorage.getItem('schedules')) {
    localStorage.setItem('schedules', JSON.stringify(mockSchedules));
  }
};

// Auth helpers
export const login = (email: string, password: string): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Attendance helpers
export const getTodayAttendance = (): AttendanceRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  const attendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]');
  return attendance.filter(a => a.tanggal === today);
};

export const getUserAttendance = (userId: string): AttendanceRecord[] => {
  const attendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]');
  return attendance.filter(a => a.userId === userId);
};

export const recordAttendance = (userId: string, status: AttendanceRecord['status']): AttendanceRecord => {
  const attendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]');
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
  const existingIndex = attendance.findIndex(a => a.userId === userId && a.tanggal === today);
  
  const newRecord: AttendanceRecord = {
    id: `ATT${Date.now()}`,
    userId,
    tanggal: today,
    waktuMasuk: now,
    status
  };
  
  if (existingIndex >= 0) {
    attendance[existingIndex] = { ...attendance[existingIndex], ...newRecord };
  } else {
    attendance.push(newRecord);
  }
  
  localStorage.setItem('attendance', JSON.stringify(attendance));
  return newRecord;
};

export const getStudents = (): User[] => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  return users.filter(u => u.role === 'siswa');
};

export const getTodaySchedules = (kelas: string): Schedule[] => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = days[new Date().getDay()];
  const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
  return schedules.filter(s => s.hari === today && s.kelas === kelas);
};
