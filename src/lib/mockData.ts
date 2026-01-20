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
  ruangan?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jenis: 'izin' | 'sakit';
  alasan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Book {
  id: string;
  judul: string;
  penulis: string;
  kategori: string;
  stok: number;
  cover?: string;
  deskripsi?: string;
  tahunTerbit?: number;
}

export interface BookBorrow {
  id: string;
  userId: string;
  bookId: string;
  tanggalPinjam: string;
  tanggalKembali?: string;
  status: 'dipinjam' | 'dikembalikan';
}

export interface Announcement {
  id: string;
  judul: string;
  isi: string;
  kategori: 'umum' | 'akademik' | 'kegiatan' | 'penting';
  tanggal: string;
  author: string;
  pinned?: boolean;
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

// Mock Schedules - Complete weekly schedule
export const mockSchedules: Schedule[] = [
  // Senin
  { id: 'SCH001', hari: 'Senin', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Matematika', guru: 'Ibu Sari Wulandari', kelas: 'Kelas 10A', ruangan: 'R.101' },
  { id: 'SCH002', hari: 'Senin', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Bahasa Indonesia', guru: 'Bapak Andi Susanto', kelas: 'Kelas 10A', ruangan: 'R.101' },
  { id: 'SCH003', hari: 'Senin', jamMulai: '10:15', jamSelesai: '11:45', mapel: 'Bahasa Inggris', guru: 'Ibu Diana', kelas: 'Kelas 10A', ruangan: 'R.102' },
  { id: 'SCH004', hari: 'Senin', jamMulai: '12:30', jamSelesai: '14:00', mapel: 'Fisika', guru: 'Bapak Joko', kelas: 'Kelas 10A', ruangan: 'Lab Fisika' },
  // Selasa
  { id: 'SCH005', hari: 'Selasa', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Fisika', guru: 'Bapak Joko', kelas: 'Kelas 10A', ruangan: 'Lab Fisika' },
  { id: 'SCH006', hari: 'Selasa', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Kimia', guru: 'Ibu Dewi', kelas: 'Kelas 10A', ruangan: 'Lab Kimia' },
  { id: 'SCH007', hari: 'Selasa', jamMulai: '10:15', jamSelesai: '11:45', mapel: 'Biologi', guru: 'Ibu Ani', kelas: 'Kelas 10A', ruangan: 'Lab Biologi' },
  { id: 'SCH008', hari: 'Selasa', jamMulai: '12:30', jamSelesai: '14:00', mapel: 'Sejarah', guru: 'Bapak Bambang', kelas: 'Kelas 10A', ruangan: 'R.101' },
  // Rabu
  { id: 'SCH009', hari: 'Rabu', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Biologi', guru: 'Ibu Ani', kelas: 'Kelas 10A', ruangan: 'Lab Biologi' },
  { id: 'SCH010', hari: 'Rabu', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Matematika', guru: 'Ibu Sari Wulandari', kelas: 'Kelas 10A', ruangan: 'R.101' },
  { id: 'SCH011', hari: 'Rabu', jamMulai: '10:15', jamSelesai: '11:45', mapel: 'PKN', guru: 'Bapak Hadi', kelas: 'Kelas 10A', ruangan: 'R.103' },
  { id: 'SCH012', hari: 'Rabu', jamMulai: '12:30', jamSelesai: '14:00', mapel: 'Olahraga', guru: 'Bapak Rudi', kelas: 'Kelas 10A', ruangan: 'Lapangan' },
  // Kamis
  { id: 'SCH013', hari: 'Kamis', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Kimia', guru: 'Ibu Dewi', kelas: 'Kelas 10A', ruangan: 'Lab Kimia' },
  { id: 'SCH014', hari: 'Kamis', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Bahasa Inggris', guru: 'Ibu Diana', kelas: 'Kelas 10A', ruangan: 'R.102' },
  { id: 'SCH015', hari: 'Kamis', jamMulai: '10:15', jamSelesai: '11:45', mapel: 'Seni Budaya', guru: 'Ibu Ratna', kelas: 'Kelas 10A', ruangan: 'R.Seni' },
  { id: 'SCH016', hari: 'Kamis', jamMulai: '12:30', jamSelesai: '14:00', mapel: 'TIK', guru: 'Bapak Eko', kelas: 'Kelas 10A', ruangan: 'Lab Komputer' },
  // Jumat
  { id: 'SCH017', hari: 'Jumat', jamMulai: '07:00', jamSelesai: '08:30', mapel: 'Agama', guru: 'Bapak Usman', kelas: 'Kelas 10A', ruangan: 'R.Agama' },
  { id: 'SCH018', hari: 'Jumat', jamMulai: '08:30', jamSelesai: '10:00', mapel: 'Bahasa Jawa', guru: 'Ibu Siti', kelas: 'Kelas 10A', ruangan: 'R.101' },
  { id: 'SCH019', hari: 'Jumat', jamMulai: '10:15', jamSelesai: '11:30', mapel: 'BK', guru: 'Ibu Lestari', kelas: 'Kelas 10A', ruangan: 'R.BK' },
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    userId: 'STU001',
    tanggalMulai: '2026-01-15',
    tanggalSelesai: '2026-01-15',
    jenis: 'sakit',
    alasan: 'Demam tinggi, istirahat di rumah atas saran dokter',
    status: 'approved',
    createdAt: '2026-01-14T10:00:00Z'
  },
  {
    id: 'LR002',
    userId: 'STU001',
    tanggalMulai: '2026-01-10',
    tanggalSelesai: '2026-01-10',
    jenis: 'izin',
    alasan: 'Menghadiri acara keluarga',
    status: 'approved',
    createdAt: '2026-01-09T08:00:00Z'
  }
];

// Mock Books
export const mockBooks: Book[] = [
  {
    id: 'BK001',
    judul: 'Laskar Pelangi',
    penulis: 'Andrea Hirata',
    kategori: 'Novel',
    stok: 5,
    deskripsi: 'Novel inspiratif tentang perjuangan anak-anak di Belitung',
    tahunTerbit: 2005,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop'
  },
  {
    id: 'BK002',
    judul: 'Bumi Manusia',
    penulis: 'Pramoedya Ananta Toer',
    kategori: 'Novel',
    stok: 3,
    deskripsi: 'Novel sejarah tentang kehidupan di era kolonial',
    tahunTerbit: 1980,
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'
  },
  {
    id: 'BK003',
    judul: 'Matematika Dasar Kelas X',
    penulis: 'Tim Kemendikbud',
    kategori: 'Pelajaran',
    stok: 20,
    deskripsi: 'Buku pelajaran matematika untuk kelas X SMA',
    tahunTerbit: 2024,
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=300&fit=crop'
  },
  {
    id: 'BK004',
    judul: 'Fisika untuk SMA',
    penulis: 'Dr. Sutrisno',
    kategori: 'Pelajaran',
    stok: 15,
    deskripsi: 'Panduan lengkap fisika SMA',
    tahunTerbit: 2023,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop'
  },
  {
    id: 'BK005',
    judul: 'Kamus Bahasa Inggris',
    penulis: 'John Echols',
    kategori: 'Referensi',
    stok: 10,
    deskripsi: 'Kamus lengkap Indonesia-Inggris',
    tahunTerbit: 2020,
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=300&fit=crop'
  },
  {
    id: 'BK006',
    judul: 'Sapiens: A Brief History',
    penulis: 'Yuval Noah Harari',
    kategori: 'Non-Fiksi',
    stok: 2,
    deskripsi: 'Sejarah singkat umat manusia',
    tahunTerbit: 2014,
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop'
  }
];

// Mock Book Borrows
export const mockBookBorrows: BookBorrow[] = [
  {
    id: 'BB001',
    userId: 'STU001',
    bookId: 'BK001',
    tanggalPinjam: '2026-01-10',
    status: 'dipinjam'
  },
  {
    id: 'BB002',
    userId: 'STU001',
    bookId: 'BK003',
    tanggalPinjam: '2026-01-05',
    tanggalKembali: '2026-01-12',
    status: 'dikembalikan'
  }
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ANN001',
    judul: 'Libur Semester Genap 2026',
    isi: 'Diberitahukan kepada seluruh siswa bahwa libur semester genap akan dimulai tanggal 1 Februari 2026 sampai dengan 14 Februari 2026. Kegiatan belajar mengajar akan dimulai kembali pada tanggal 15 Februari 2026.',
    kategori: 'penting',
    tanggal: '2026-01-18',
    author: 'Kepala Sekolah',
    pinned: true
  },
  {
    id: 'ANN002',
    judul: 'Jadwal Ujian Akhir Semester',
    isi: 'Ujian Akhir Semester (UAS) akan dilaksanakan pada tanggal 25-31 Januari 2026. Jadwal lengkap dapat dilihat di papan pengumuman atau website sekolah.',
    kategori: 'akademik',
    tanggal: '2026-01-17',
    author: 'Wakil Kepala Sekolah Bidang Kurikulum',
    pinned: true
  },
  {
    id: 'ANN003',
    judul: 'Lomba Karya Tulis Ilmiah',
    isi: 'Dalam rangka memperingati Hari Pendidikan Nasional, sekolah mengadakan lomba karya tulis ilmiah. Pendaftaran dibuka hingga 30 Januari 2026. Hadiah menarik menanti pemenang!',
    kategori: 'kegiatan',
    tanggal: '2026-01-16',
    author: 'OSIS'
  },
  {
    id: 'ANN004',
    judul: 'Pemeliharaan Gedung Perpustakaan',
    isi: 'Perpustakaan akan tutup sementara pada tanggal 22-23 Januari 2026 untuk pemeliharaan gedung. Mohon maaf atas ketidaknyamanannya.',
    kategori: 'umum',
    tanggal: '2026-01-15',
    author: 'Bagian Sarana Prasarana'
  },
  {
    id: 'ANN005',
    judul: 'Pendaftaran Ekstrakurikuler',
    isi: 'Pendaftaran ekstrakurikuler semester genap dibuka mulai tanggal 15 Februari 2026. Pilihan ekskul: Pramuka, PMR, Basket, Voli, Paduan Suara, Teater, dan Robotik.',
    kategori: 'kegiatan',
    tanggal: '2026-01-14',
    author: 'Koordinator Kesiswaan'
  }
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
  if (!localStorage.getItem('leaveRequests')) {
    localStorage.setItem('leaveRequests', JSON.stringify(mockLeaveRequests));
  }
  if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(mockBooks));
  }
  if (!localStorage.getItem('bookBorrows')) {
    localStorage.setItem('bookBorrows', JSON.stringify(mockBookBorrows));
  }
  if (!localStorage.getItem('announcements')) {
    localStorage.setItem('announcements', JSON.stringify(mockAnnouncements));
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

export const getAllSchedules = (kelas: string): Schedule[] => {
  const schedules: Schedule[] = JSON.parse(localStorage.getItem('schedules') || '[]');
  return schedules.filter(s => s.kelas === kelas);
};

// Leave request helpers
export const getUserLeaveRequests = (userId: string): LeaveRequest[] => {
  const requests: LeaveRequest[] = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
  return requests.filter(r => r.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const createLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): LeaveRequest => {
  const requests: LeaveRequest[] = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
  const newRequest: LeaveRequest = {
    ...data,
    id: `LR${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  requests.push(newRequest);
  localStorage.setItem('leaveRequests', JSON.stringify(requests));
  return newRequest;
};

// Book helpers
export const getBooks = (): Book[] => {
  return JSON.parse(localStorage.getItem('books') || '[]');
};

export const getUserBookBorrows = (userId: string): (BookBorrow & { book: Book })[] => {
  const borrows: BookBorrow[] = JSON.parse(localStorage.getItem('bookBorrows') || '[]');
  const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
  
  return borrows
    .filter(b => b.userId === userId)
    .map(b => ({
      ...b,
      book: books.find(book => book.id === b.bookId)!
    }))
    .filter(b => b.book);
};

export const borrowBook = (userId: string, bookId: string): BookBorrow => {
  const borrows: BookBorrow[] = JSON.parse(localStorage.getItem('bookBorrows') || '[]');
  const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
  
  // Update book stock
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex >= 0 && books[bookIndex].stok > 0) {
    books[bookIndex].stok -= 1;
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  const newBorrow: BookBorrow = {
    id: `BB${Date.now()}`,
    userId,
    bookId,
    tanggalPinjam: new Date().toISOString().split('T')[0],
    status: 'dipinjam'
  };
  
  borrows.push(newBorrow);
  localStorage.setItem('bookBorrows', JSON.stringify(borrows));
  return newBorrow;
};

export const returnBook = (borrowId: string): void => {
  const borrows: BookBorrow[] = JSON.parse(localStorage.getItem('bookBorrows') || '[]');
  const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
  
  const borrowIndex = borrows.findIndex(b => b.id === borrowId);
  if (borrowIndex >= 0) {
    const borrow = borrows[borrowIndex];
    borrows[borrowIndex] = {
      ...borrow,
      status: 'dikembalikan',
      tanggalKembali: new Date().toISOString().split('T')[0]
    };
    
    // Update book stock
    const bookIndex = books.findIndex(b => b.id === borrow.bookId);
    if (bookIndex >= 0) {
      books[bookIndex].stok += 1;
      localStorage.setItem('books', JSON.stringify(books));
    }
    
    localStorage.setItem('bookBorrows', JSON.stringify(borrows));
  }
};

// Announcement helpers
export const getAnnouncements = (): Announcement[] => {
  const announcements: Announcement[] = JSON.parse(localStorage.getItem('announcements') || '[]');
  return announcements.sort((a, b) => {
    // Pinned first, then by date
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  });
};
