import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, AlertCircle, Clock, XCircle, Filter, Users, TrendingUp, UserCheck, UserX } from "lucide-react";
import { getCurrentUser, getSubjectAttendance, getAllSubjectAttendance, getAllSchedules, getStudents, type User, type SubjectAttendance } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/cards/StatCard";

export default function PresensiMapel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState<SubjectAttendance[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<string>('semua');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Map<string, SubjectAttendance[]>>(new Map());

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || (currentUser.role !== 'siswa' && currentUser.role !== 'guru')) {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Get all unique subjects from schedules - use Kelas 10A for guru
    const kelas = currentUser.role === 'siswa' ? (currentUser.kelas || 'Kelas 10A') : 'Kelas 10A';
    const schedules = getAllSchedules(kelas);
    const uniqueSubjects = [...new Set(schedules.map(s => s.mapel))];
    setSubjects(uniqueSubjects);

    if (currentUser.role === 'siswa') {
      // Get subject attendance for this student only
      const data = getSubjectAttendance(currentUser.id);
      setAttendanceData(data);
    } else {
      // For guru, get all students and ALL their attendance using new function
      const allStudents = getStudents();
      setStudents(allStudents);
      
      // Get all attendance data at once
      const allAttendance = getAllSubjectAttendance();
      
      // Create a map of student ID to their attendance
      const attendanceMap = new Map<string, SubjectAttendance[]>();
      allStudents.forEach(student => {
        const studentAttendance = allAttendance.filter(a => a.userId === student.id);
        attendanceMap.set(student.id, studentAttendance);
      });
      
      setStudentAttendanceMap(attendanceMap);
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

  // Group attendance by subject for summary (Guru view)
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

  // Simple subject status for Siswa view
  const getLatestStatusPerSubject = () => {
    const latestStatus: Map<string, SubjectAttendance> = new Map();
    
    attendanceData.forEach(record => {
      const existing = latestStatus.get(record.mapel);
      if (!existing || new Date(record.tanggal) > new Date(existing.tanggal)) {
        latestStatus.set(record.mapel, record);
      }
    });
    
    return Array.from(latestStatus.values());
  };

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

  // Get students with their attendance for a specific subject (Guru view)
  const getStudentsWithAttendance = (mapel: string) => {
    return students.map(student => {
      const studentData = studentAttendanceMap.get(student.id) || [];
      const subjectRecords = studentData.filter(a => a.mapel === mapel);
      const latestRecord = subjectRecords.sort((a, b) => 
        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      )[0];
      
      return {
        ...student,
        latestStatus: latestRecord?.status || 'tidak_hadir',
        latestDate: latestRecord?.tanggal,
        totalHadir: subjectRecords.filter(r => r.status === 'hadir' || r.status === 'terlambat').length,
        totalPertemuan: subjectRecords.length
      };
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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
            {isGuru ? 'Presensi Per Mata Pelajaran' : 'Status Kehadiran Mapel'}
          </h1>
        </div>
        <p className="text-white/80 text-sm">
          {isGuru 
            ? 'Kelola dan lihat rekap kehadiran siswa per mata pelajaran'
            : 'Lihat status kehadiran Anda di setiap mata pelajaran'}
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
        {/* GURU VIEW - Full detailed view with student names and stats */}
        {isGuru && (
          <>
            {/* Overall Statistics Cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Users className="w-6 h-6" />}
                value={students.length}
                label="Total Siswa"
                iconColor="text-primary"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                value={`${Math.round((subjectSummary.reduce((acc, s) => acc + s.hadir + s.terlambat, 0) / Math.max(subjectSummary.reduce((acc, s) => acc + s.total, 0), 1)) * 100)}%`}
                label="Rata-rata Kehadiran"
                iconColor="text-success"
              />
              <StatCard
                icon={<UserCheck className="w-6 h-6" />}
                value={subjectSummary.reduce((acc, s) => acc + s.hadir, 0)}
                label="Total Hadir"
                iconColor="text-success"
              />
              <StatCard
                icon={<UserX className="w-6 h-6" />}
                value={subjectSummary.reduce((acc, s) => acc + s.tidakHadir, 0)}
                label="Total Tidak Hadir"
                iconColor="text-destructive"
              />
            </div>

            {/* Subject Summary Cards with Percentage */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Ringkasan Per Mata Pelajaran ({subjects.length} Mapel)
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

                    {/* Student List for this subject */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-3">Daftar Siswa</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getStudentsWithAttendance(summary.mapel).map((student) => (
                          <div 
                            key={student.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={student.avatar} alt={student.nama} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                  {getInitials(student.nama)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-foreground">{student.nama}</p>
                                <p className="text-xs text-muted-foreground">
                                  {student.totalHadir}/{student.totalPertemuan} hadir
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={student.latestStatus as any} />
                          </div>
                        ))}
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

            {/* Filter and History */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Riwayat Presensi Detail
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

            {/* Detailed Attendance List for Guru */}
            <div className="space-y-2">
              {filteredAttendance.map((record) => {
                const student = students.find(s => {
                  const studentData = studentAttendanceMap.get(s.id);
                  return studentData?.some(a => a.id === record.id);
                });
                
                return (
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
                        <p className="font-medium text-foreground">{student?.nama || 'Siswa'}</p>
                        <p className="text-xs text-muted-foreground">{record.mapel} • {formatDate(record.tanggal)}</p>
                      </div>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                );
              })}

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
          </>
        )}

        {/* SISWA VIEW - Simple status per subject only */}
        {!isGuru && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Status Kehadiran Per Mata Pelajaran
            </h3>
            <div className="space-y-3">
              {getLatestStatusPerSubject().map((record) => (
                <div 
                  key={record.id}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        getSubjectColor(record.mapel)
                      )}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{record.mapel}</p>
                        <p className="text-xs text-muted-foreground">{record.guru}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Pertemuan terakhir: {formatDate(record.tanggal)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                </div>
              ))}

              {getLatestStatusPerSubject().length === 0 && (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="font-medium text-foreground">Belum Ada Data</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Data kehadiran akan muncul setelah guru mengisi presensi
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav 
        activeTab="beranda" 
        onTabChange={handleNavChange} 
        role={user.role} 
      />
    </div>
  );
}
