
# Plan: Sinkronisasi Data Antar Modul Siswa dan Guru

## Ringkasan
Mengimplementasikan sinkronisasi data yang konsisten dan persisten antara modul Siswa dan Guru, termasuk perbaikan warna kalender untuk status "Tidak Hadir" yang seharusnya merah, bukan ungu.

---

## Masalah yang Ditemukan

### 1. Warna Kalender Januari 2026 (Tanggal 28-29)
Status "Tidak Hadir" menampilkan warna ungu (bg-primary) padahal seharusnya merah (bg-destructive). Ini terjadi karena:
- Ada kesamaan warna antara `izin` dan `primary` dalam fungsi `getStatusColor`
- Data mock mungkin tidak konsisten dengan tanggal yang ditampilkan

### 2. Data Tidak Tersinkronisasi
- **Koreksi Presensi**: Data disimpan per user (`correction_requests_{userId}`) - Guru tidak bisa melihat
- **Izin Siswa**: Sudah tersinkronisasi dengan benar via `getAllLeaveRequests()`
- **Pengumuman**: Sudah tersinkronisasi dengan benar via shared localStorage

---

## Solusi yang Akan Diimplementasikan

### A. Perbaikan Warna Kalender (File: `src/pages/Riwayat.tsx`)

**Perubahan pada fungsi `getStatusColor`:**
```text
Sebelum:
- 'izin': 'bg-primary text-white' (ungu)

Sesudah:
- 'izin': 'bg-accent text-white' (warna berbeda dari tidak_hadir)
- Memastikan 'tidak_hadir' tetap 'bg-destructive text-white' (merah)
```

**Perubahan pada Legend kalender:**
- Memisahkan warna Izin dan Sakit agar lebih jelas perbedaannya

### B. Sinkronisasi Koreksi Presensi (File: `src/lib/mockData.ts`)

**Tambah interface dan storage baru:**
```typescript
export interface CorrectionRequest {
  id: string;
  userId: string;
  namaSiswa: string;
  kelas: string;
  tanggal: string;
  jenisKoreksi: string;
  alasan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  catatanGuru?: string;
}
```

**Tambah helper functions:**
- `createCorrectionRequest()` - Siswa mengajukan koreksi
- `getAllCorrectionRequests()` - Guru melihat semua pengajuan
- `getUserCorrectionRequests()` - Siswa melihat pengajuan sendiri
- `updateCorrectionRequestStatus()` - Guru approve/reject

### C. Update Halaman Koreksi Presensi (File: `src/pages/KoreksiPresensi.tsx`)

Menggunakan fungsi baru dari mockData.ts untuk menyimpan data secara terpusat

### D. Tambah Fitur Kelola Koreksi untuk Guru (File baru: `src/pages/KelolaKoreksi.tsx`)

Halaman baru untuk Guru melihat dan mengelola pengajuan koreksi presensi dari siswa

### E. Update Dashboard Guru (File: `src/pages/GuruDashboard.tsx`)

Menambahkan notifikasi/badge untuk pengajuan koreksi yang pending

### F. Force Refresh Data Attendance

**Tambah data mock untuk tanggal 28-29 Januari 2026:**
```typescript
{ id: 'ATT_JAN28', userId: 'STU001', tanggal: '2026-01-28', status: 'tidak_hadir' },
{ id: 'ATT_JAN29', userId: 'STU001', tanggal: '2026-01-29', status: 'tidak_hadir' },
```

**Tambah fungsi untuk refresh/reset data:**
- `forceRefreshAttendance()` - Reset dan regenerate attendance data

---

## Detail Teknis

### File yang Akan Diubah:
1. `src/lib/mockData.ts` - Tambah interface, mock data, dan helper functions
2. `src/pages/Riwayat.tsx` - Perbaiki warna status kalender
3. `src/pages/KoreksiPresensi.tsx` - Gunakan storage terpusat
4. `src/pages/GuruDashboard.tsx` - Tambah notifikasi pending koreksi
5. `src/App.tsx` - Tambah route baru

### File Baru:
1. `src/pages/KelolaKoreksi.tsx` - Halaman guru untuk kelola koreksi

---

## Alur Data Setelah Implementasi

```text
┌─────────────────────────────────────────────────────────────────┐
│                    SHARED LOCALSTORAGE                          │
├─────────────────────────────────────────────────────────────────┤
│  leaveRequests     → Izin/Sakit (Siswa ajukan, Guru kelola)     │
│  correctionRequests→ Koreksi Presensi (Siswa ajukan, Guru kelola)│
│  attendance        → Data Presensi Harian                        │
│  announcements     → Pengumuman (Guru buat, Siswa lihat)         │
│  subjectAttendance → Presensi Per Mapel                          │
└─────────────────────────────────────────────────────────────────┘
         ↑                                      ↑
         │                                      │
    ┌────┴────┐                           ┌────┴────┐
    │  SISWA  │                           │  GURU   │
    │ Module  │                           │ Module  │
    └─────────┘                           └─────────┘
```

---

## Hasil Akhir
- Siswa mengajukan koreksi → Guru langsung melihat di dashboard
- Siswa mengajukan izin → Guru langsung melihat dan bisa approve/reject
- Warna kalender konsisten: Merah = Tidak Hadir, Ungu = Izin, Hijau = Hadir
- Data tersinkronisasi dan persisten di localStorage
