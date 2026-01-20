import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, Library, Bell, ClipboardEdit, Users, TrendingUp, Clock, CalendarDays, Download, Calendar, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/BottomNav";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { StatCard } from "@/components/cards/StatCard";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { AttendanceListItem } from "@/components/cards/AttendanceListItem";
import { getCurrentUser, logout, getStudents, getTodayAttendance, type User, type AttendanceRecord } from "@/lib/mockData";
import { toast } from "sonner";

export default function GuruDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('beranda');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Load students and attendance
    const allStudents = getStudents();
    setStudents(allStudents);
    setAttendanceRecords(getTodayAttendance());
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar');
    navigate('/');
  };

  if (!user) return null;

  const features = [
    { icon: <BookOpen className="w-6 h-6" />, label: 'Jadwal Mapel', bgColor: 'purple' as const, iconBgColor: 'bg-primary' },
    { icon: <FileText className="w-6 h-6" />, label: 'Izin', bgColor: 'yellow' as const, iconBgColor: 'bg-warning' },
    { icon: <Library className="w-6 h-6" />, label: 'Perpustakaan', bgColor: 'green' as const, iconBgColor: 'bg-success' },
    { icon: <Bell className="w-6 h-6" />, label: 'Pengumuman', bgColor: 'pink' as const, iconBgColor: 'bg-destructive' },
    { icon: <ClipboardEdit className="w-6 h-6" />, label: 'Koreksi Presensi', bgColor: 'cyan' as const, iconBgColor: 'bg-accent' },
    { icon: <Users className="w-6 h-6" />, label: 'Perilaku Siswa', bgColor: 'blue' as const, iconBgColor: 'bg-primary' },
  ];

  // Calculate stats
  const totalStudents = students.length;
  const hadirCount = attendanceRecords.filter(a => a.status === 'hadir').length;
  const terlambatCount = attendanceRecords.filter(a => a.status === 'terlambat').length;
  const tidakHadirCount = totalStudents - hadirCount - terlambatCount;
  const attendancePercentage = totalStudents > 0 ? Math.round(((hadirCount + terlambatCount) / totalStudents) * 100) : 0;

  // Filter students by search
  const filteredStudents = students.filter(student =>
    student.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get student attendance with status
  const getStudentWithAttendance = (student: User) => {
    const record = attendanceRecords.find(a => a.userId === student.id);
    return {
      ...student,
      attendanceStatus: record?.status || 'tidak_hadir',
      waktu: record?.waktuMasuk
    };
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <UserHeader user={user} onLogout={handleLogout} />

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value={totalStudents}
            label="Total Siswa"
            iconColor="text-primary"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            value={hadirCount}
            label="Hadir Hari Ini"
            iconColor="text-success"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            value={terlambatCount}
            label="Terlambat Hari Ini"
            iconColor="text-warning"
          />
          <StatCard
            icon={<CalendarDays className="w-6 h-6" />}
            value={tidakHadirCount}
            label="Tidak Hadir Hari Ini"
            iconColor="text-destructive"
          />
        </div>

        {/* Attendance Percentage */}
        <div className="gradient-success rounded-2xl p-6 text-center text-white">
          <p className="text-4xl font-bold">{attendancePercentage}%</p>
          <p className="text-sm text-white/80 mt-1">Tingkat Kehadiran Keseluruhan</p>
        </div>

        {/* Features Grid */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Fitur Guru</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                label={feature.label}
                bgColor={feature.bgColor}
                iconBgColor={feature.iconBgColor}
              />
            ))}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="bg-card rounded-xl border border-border p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Presensi Hari Ini</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border">
                <Download className="w-3 h-3" />
                Ekspor
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border">
                <Calendar className="w-3 h-3" />
                Riwayat
              </button>
            </div>
          </div>

          {/* View Button */}
          <Button className="w-full gradient-success text-white font-medium py-4 rounded-xl mb-4">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            📊 Lihat Presensi Per Mata Pelajaran
          </Button>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Student List */}
          <div className="space-y-0">
            {filteredStudents.map((student) => {
              const withAttendance = getStudentWithAttendance(student);
              return (
                <AttendanceListItem
                  key={student.id}
                  nama={student.nama}
                  nis={student.nis || ''}
                  kelas={student.kelas || ''}
                  status={withAttendance.attendanceStatus as 'hadir' | 'terlambat' | 'tidak_hadir'}
                  waktu={withAttendance.waktu}
                  avatar={student.avatar}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} role="guru" />
    </div>
  );
}
