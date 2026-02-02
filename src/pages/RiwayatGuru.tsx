import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Users, CheckCircle2, Clock, XCircle, Edit2, Save, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser, getStudents, type User, type AttendanceRecord } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { toast } from "sonner";

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function RiwayatGuru() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceRecord['status']>('hadir');
  const [filterStatus, setFilterStatus] = useState<string>('semua');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setStudents(getStudents());
    loadAttendance();
  }, [navigate]);

  const loadAttendance = () => {
    const att: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]');
    setAttendance(att);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const selectedDateStr = currentDate.toISOString().split('T')[0];

  const prevDay = () => setCurrentDate(new Date(year, month, currentDate.getDate() - 1));
  const nextDay = () => setCurrentDate(new Date(year, month, currentDate.getDate() + 1));

  const getAttendanceForStudent = (studentId: string) => {
    return attendance.find(a => a.userId === studentId && a.tanggal === selectedDateStr);
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir': return 'bg-success text-white';
      case 'terlambat': return 'bg-warning text-white';
      case 'tidak_hadir': return 'bg-destructive text-white';
      case 'izin': return 'bg-primary text-white';
      case 'sakit': return 'bg-accent text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir': return <CheckCircle2 className="w-4 h-4" />;
      case 'terlambat': return <Clock className="w-4 h-4" />;
      case 'tidak_hadir': return <XCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status?: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'terlambat': return 'Terlambat';
      case 'tidak_hadir': return 'Tidak Hadir';
      case 'izin': return 'Izin';
      case 'sakit': return 'Sakit';
      default: return 'Belum Presensi';
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nama.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'semua') return matchesSearch;
    
    const att = getAttendanceForStudent(student.id);
    if (filterStatus === 'belum') return matchesSearch && !att;
    return matchesSearch && att?.status === filterStatus;
  });

  // Stats for the day
  const dayStats = {
    total: students.length,
    hadir: students.filter(s => getAttendanceForStudent(s.id)?.status === 'hadir').length,
    terlambat: students.filter(s => getAttendanceForStudent(s.id)?.status === 'terlambat').length,
    tidak_hadir: students.filter(s => {
      const att = getAttendanceForStudent(s.id);
      return !att || att.status === 'tidak_hadir';
    }).length,
  };

  const handleEditAttendance = (student: User) => {
    const existingRecord = getAttendanceForStudent(student.id);
    setSelectedStudent(student);
    setEditingRecord(existingRecord || null);
    setNewStatus(existingRecord?.status || 'hadir');
  };

  const handleSaveAttendance = () => {
    if (!selectedStudent) return;

    const allAttendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]');
    const existingIndex = allAttendance.findIndex(
      a => a.userId === selectedStudent.id && a.tanggal === selectedDateStr
    );

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newRecord: AttendanceRecord = {
      id: editingRecord?.id || `ATT${Date.now()}`,
      userId: selectedStudent.id,
      tanggal: selectedDateStr,
      waktuMasuk: editingRecord?.waktuMasuk || (newStatus === 'hadir' || newStatus === 'terlambat' ? now : undefined),
      status: newStatus,
      keterangan: newStatus === 'izin' ? 'Izin oleh guru' : newStatus === 'sakit' ? 'Sakit' : undefined
    };

    if (existingIndex >= 0) {
      allAttendance[existingIndex] = newRecord;
    } else {
      allAttendance.push(newRecord);
    }

    localStorage.setItem('attendance', JSON.stringify(allAttendance));
    loadAttendance();
    setSelectedStudent(null);
    toast.success('Presensi berhasil diperbarui');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-violet-600 px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/guru')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Kelola Presensi</h1>
            <p className="text-sm text-white/80">Koreksi dan lihat riwayat</p>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-white/20 rounded-xl p-3 backdrop-blur-sm">
          <button onClick={prevDay} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-semibold">
              {currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={nextDay} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-xl shadow-lg p-4 grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{dayStats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-success">{dayStats.hadir}</p>
            <p className="text-[10px] text-muted-foreground">Hadir</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-warning">{dayStats.terlambat}</p>
            <p className="text-[10px] text-muted-foreground">Terlambat</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-destructive">{dayStats.tidak_hadir}</p>
            <p className="text-[10px] text-muted-foreground">Absen</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="hadir">Hadir</SelectItem>
              <SelectItem value="terlambat">Terlambat</SelectItem>
              <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
              <SelectItem value="belum">Belum Presensi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {filteredStudents.map((student, index) => {
            const att = getAttendanceForStudent(student.id);
            return (
              <div
                key={student.id}
                className={cn(
                  "flex items-center gap-3 p-4",
                  index !== filteredStudents.length - 1 && "border-b border-border"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                  <img src={student.avatar} alt={student.nama} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{student.nama}</p>
                  <p className="text-xs text-muted-foreground">{student.nis} • {student.kelas}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    att ? getStatusColor(att.status) : "bg-muted text-muted-foreground"
                  )}>
                    {getStatusIcon(att?.status)}
                    {getStatusLabel(att?.status)}
                  </span>
                  <button
                    onClick={() => handleEditAttendance(student)}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium text-foreground">Tidak Ada Siswa</p>
              <p className="text-sm text-muted-foreground">Tidak ada siswa yang sesuai filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Presensi</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="w-12 h-12 rounded-full bg-background overflow-hidden">
                  <img src={selectedStudent.avatar} alt={selectedStudent.nama} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedStudent.nama}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.nis} • {selectedStudent.kelas}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tanggal: {currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Status Kehadiran</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['hadir', 'terlambat', 'tidak_hadir', 'izin', 'sakit'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={cn(
                        "py-3 rounded-xl font-medium transition-all capitalize",
                        newStatus === status
                          ? getStatusColor(status)
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveAttendance}
                className="w-full gradient-primary text-white py-5 rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav activeTab="riwayat" onTabChange={(tab) => {
        if (tab === 'beranda') navigate('/guru');
        if (tab === 'analitik') navigate('/analitik');
        if (tab === 'profil') navigate('/profil-guru');
      }} role="guru" />
    </div>
  );
}
