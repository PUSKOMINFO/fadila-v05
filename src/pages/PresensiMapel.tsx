import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, AlertCircle, Clock, XCircle, Filter, Users } from "lucide-react";
import { getCurrentUser, getSubjectAttendance, getAllSchedules, getStudents, type User, type SubjectAttendance } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function PresensiMapel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState<SubjectAttendance[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<string>('semua');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || (currentUser.role !== 'siswa' && currentUser.role !== 'guru')) {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Get all unique subjects from schedules
    const kelas = currentUser.role === 'siswa' ? (currentUser.kelas || '') : 'XII IPA 1';
    const schedules = getAllSchedules(kelas);
    const uniqueSubjects = [...new Set(schedules.map(s => s.mapel))];
    setSubjects(uniqueSubjects);

    if (currentUser.role === 'siswa') {
      // Get subject attendance for this student
      const data = getSubjectAttendance(currentUser.id);
      setAttendanceData(data);
    } else {
      // For guru, get all students and their attendance
      const allStudents = getStudents();
      setStudents(allStudents);
      // Aggregate all students' attendance data
      const allAttendance: SubjectAttendance[] = [];
      allStudents.forEach(student => {
        const studentAttendance = getSubjectAttendance(student.id);
        allAttendance.push(...studentAttendance);
      });
      setAttendanceData(allAttendance);
    }
  }, [navigate]);

  const handleNavChange = (tab: string) => {
    if (user?.role === 'guru') {
      if (tab === 'beranda') navigate('/guru');
      if (tab === 'riwayat') navigate('/riwayat-guru');
      if (tab === 'profil') navigate('/profil-guru');
    } else {
      if (tab === 'beranda') navigate('/siswa');
      if (tab === 'riwayat') navigate('/riwayat');
      if (tab === 'profil') navigate('/profil');
    }
  };

  if (!user) return null;

  const isGuru = user.role === 'guru';

  // Filter attendance by selected subject
  const filteredAttendance = selectedMapel === 'semua' 
    ? attendanceData 
    : attendanceData.filter(a => a.mapel === selectedMapel);

  // Group attendance by subject for summary
  const subjectSummary = subjects.map(mapel => {
    const subjectData = attendanceData.filter(a => a.mapel === mapel);
    const hadir = subjectData.filter(a => a.status === 'hadir').length;
    const terlambat = subjectData.filter(a => a.status === 'terlambat').length;
    const tidakHadir = subjectData.filter(a => a.status === 'tidak_hadir').length;
    const izin = subjectData.filter(a => a.status === 'izin').length;
    const sakit = subjectData.filter(a => a.status === 'sakit').length;
    const total = subjectData.length;
    const percentage = total > 0 ? Math.round(((hadir + terlambat) / total) * 100) : 0;

    return { mapel, hadir, terlambat, tidakHadir, izin, sakit, total, percentage };
  });

  const getSubjectColor = (mapel: string) => {
    const colors: Record<string, string> = {
      'Matematika': 'from-blue-500 to-blue-600',
      'Bahasa Indonesia': 'from-red-500 to-red-600',
      'Bahasa Inggris': 'from-purple-500 to-purple-600',
      'Fisika': 'from-orange-500 to-orange-600',
      'Kimia': 'from-green-500 to-green-600',
      'Biologi': 'from-emerald-500 to-emerald-600',
      'Sejarah': 'from-amber-500 to-amber-600',
      'PKN': 'from-cyan-500 to-cyan-600',
      'Olahraga': 'from-lime-500 to-lime-600',
      'Seni Budaya': 'from-pink-500 to-pink-600',
      'TIK': 'from-indigo-500 to-indigo-600',
      'Agama': 'from-teal-500 to-teal-600',
      'Bahasa Jawa': 'from-yellow-500 to-yellow-600',
      'BK': 'from-rose-500 to-rose-600',
    };
    return colors[mapel] || 'from-gray-500 to-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'terlambat': return <Clock className="w-4 h-4 text-warning" />;
      case 'tidak_hadir': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'izin': return <AlertCircle className="w-4 h-4 text-info" />;
      case 'sakit': return <AlertCircle className="w-4 h-4 text-info" />;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-4 pt-12 pb-6 text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(isGuru ? '/guru' : '/siswa')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {isGuru ? 'Presensi Per Mata Pelajaran' : 'Presensi Mata Pelajaran'}
          </h1>
        </div>
        <p className="text-white/80 text-sm">
          {isGuru 
            ? 'Kelola dan lihat rekap kehadiran siswa per mata pelajaran'
            : 'Data presensi per mata pelajaran yang dikelola oleh guru mapel'}
        </p>
        {isGuru && (
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4" />
              <span>{students.length} Siswa</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <BookOpen className="w-4 h-4" />
              <span>{subjects.length} Mapel</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Subject Summary Cards */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Ringkasan Per Mata Pelajaran
          </h3>
          <div className="space-y-3">
            {subjectSummary.map((summary) => (
              <div 
                key={summary.mapel}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      getSubjectColor(summary.mapel)
                    )}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{summary.mapel}</p>
                      <p className="text-xs text-muted-foreground">{summary.total} pertemuan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-bold",
                      summary.percentage >= 75 ? "text-success" : 
                      summary.percentage >= 50 ? "text-warning" : "text-destructive"
                    )}>
                      {summary.percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">Kehadiran</p>
                  </div>
                </div>
                
                {/* Status breakdown */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-success/10 rounded-lg p-2">
                    <p className="font-semibold text-success">{summary.hadir}</p>
                    <p className="text-muted-foreground">Hadir</p>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-2">
                    <p className="font-semibold text-warning">{summary.terlambat}</p>
                    <p className="text-muted-foreground">Telat</p>
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-2">
                    <p className="font-semibold text-destructive">{summary.tidakHadir}</p>
                    <p className="text-muted-foreground">Alpha</p>
                  </div>
                  <div className="bg-info/10 rounded-lg p-2">
                    <p className="font-semibold text-info">{summary.izin}</p>
                    <p className="text-muted-foreground">Izin</p>
                  </div>
                  <div className="bg-info/10 rounded-lg p-2">
                    <p className="font-semibold text-info">{summary.sakit}</p>
                    <p className="text-muted-foreground">Sakit</p>
                  </div>
                </div>
              </div>
            ))}

            {subjectSummary.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-medium text-foreground">Belum Ada Data</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Data presensi mata pelajaran akan muncul setelah guru mengisi kehadiran
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filter by Subject */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Riwayat Presensi
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setSelectedMapel('semua')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedMapel === 'semua'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Semua
            </button>
            {subjects.map((mapel) => (
              <button
                key={mapel}
                onClick={() => setSelectedMapel(mapel)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedMapel === mapel
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {mapel}
              </button>
            ))}
          </div>
        </div>

        {/* Attendance List */}
        <div className="space-y-2">
          {filteredAttendance.map((record) => (
            <div
              key={record.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                  getSubjectColor(record.mapel)
                )}>
                  {getStatusIcon(record.status)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{record.mapel}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(record.tanggal)}</p>
                  <p className="text-xs text-muted-foreground">{record.guru}</p>
                </div>
              </div>
              <StatusBadge status={record.status} />
            </div>
          ))}

          {filteredAttendance.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium text-foreground">Tidak Ada Data</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedMapel === 'semua' 
                  ? 'Belum ada riwayat presensi mata pelajaran'
                  : `Belum ada data presensi untuk ${selectedMapel}`}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav 
        activeTab="beranda" 
        onTabChange={handleNavChange} 
        role={user.role} 
      />
    </div>
  );
}
