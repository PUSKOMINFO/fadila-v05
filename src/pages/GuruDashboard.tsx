import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/BottomNav";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { StatCard } from "@/components/cards/StatCard";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { AttendanceListItem } from "@/components/cards/AttendanceListItem";
import { 
  UsersIcon, 
  PresentIcon, 
  LateIcon, 
  AbsentIcon,
  BookIcon,
  DocumentIcon,
  LibraryIcon,
  BellIcon,
  ClipboardIcon,
  StudentListIcon,
  DownloadIcon,
  ScheduleIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertIcon,
  TrendUpIcon
} from "@/components/icons/FlatIcons";
import { getCurrentUser, logout, getStudents, getTodayAttendance, getPendingCorrectionCount, getPendingLeaveCount, type User, type AttendanceRecord } from "@/lib/mockData";
import { toast } from "sonner";

export default function GuruDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('beranda');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [pendingCorrectionCount, setPendingCorrectionCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);

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
    
    // Load pending counts for notifications
    setPendingCorrectionCount(getPendingCorrectionCount());
    setPendingLeaveCount(getPendingLeaveCount());
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar');
    navigate('/');
  };

  if (!user) return null;

  const features = [
    { icon: <BookIcon size={24} />, label: 'Jadwal Mengajar', bgColor: 'purple' as const, iconBgColor: 'bg-primary', path: '/jadwal' },
    { icon: <DocumentIcon size={24} />, label: 'Izin Siswa', bgColor: 'yellow' as const, iconBgColor: 'bg-warning', path: '/izin', badge: pendingLeaveCount },
    { icon: <LibraryIcon size={24} />, label: 'Perpustakaan', bgColor: 'green' as const, iconBgColor: 'bg-success', path: '/perpustakaan' },
    { icon: <BellIcon size={24} />, label: 'Pengumuman', bgColor: 'pink' as const, iconBgColor: 'bg-destructive', path: '/pengumuman' },
    { icon: <ClipboardIcon size={24} />, label: 'Koreksi Presensi', bgColor: 'cyan' as const, iconBgColor: 'bg-accent', path: '/kelola-koreksi', badge: pendingCorrectionCount },
    { icon: <StudentListIcon size={24} />, label: 'Daftar Siswa', bgColor: 'blue' as const, iconBgColor: 'bg-primary', path: '/daftar-siswa' },
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
            icon={<UsersIcon size={28} />}
            value={totalStudents}
            label="Total Siswa"
          />
          <StatCard
            icon={<PresentIcon size={28} />}
            value={hadirCount}
            label="Hadir Hari Ini"
          />
          <StatCard
            icon={<LateIcon size={28} />}
            value={terlambatCount}
            label="Terlambat Hari Ini"
          />
          <StatCard
            icon={<AbsentIcon size={28} />}
            value={tidakHadirCount}
            label="Tidak Hadir Hari Ini"
          />
        </div>

        {/* Attendance Percentage */}
        <div className="gradient-success rounded-2xl p-6 text-center text-white">
          <p className="text-4xl font-bold">{attendancePercentage}%</p>
          <p className="text-sm text-white/80 mt-1">Tingkat Kehadiran Keseluruhan</p>
        </div>

        {/* Pending Notifications Banner */}
        {(pendingCorrectionCount > 0 || pendingLeaveCount > 0) && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <AlertIcon size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Pengajuan Menunggu</h4>
                <p className="text-sm text-muted-foreground">
                  {pendingLeaveCount > 0 && `${pendingLeaveCount} izin`}
                  {pendingLeaveCount > 0 && pendingCorrectionCount > 0 && ' dan '}
                  {pendingCorrectionCount > 0 && `${pendingCorrectionCount} koreksi`}
                  {' '}perlu ditindaklanjuti
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Fitur Guru</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <FeatureCard
                  icon={feature.icon}
                  label={feature.label}
                  bgColor={feature.bgColor}
                  iconBgColor={feature.iconBgColor}
                  onClick={() => navigate(feature.path)}
                />
                {feature.badge && feature.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {feature.badge}
                  </span>
                )}
              </div>
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
                <DownloadIcon size={14} />
                Ekspor
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border">
                <ScheduleIcon size={14} />
                Riwayat
              </button>
            </div>
          </div>

        {/* Enhanced Subject Attendance Button */}
        <button 
          onClick={() => navigate('/presensi-mapel')}
          className="group w-full relative overflow-hidden rounded-2xl p-4 mb-4 bg-gradient-to-r from-primary via-primary/90 to-accent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon Container with Animation */}
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                <BookIcon size={28} />
              </div>
              
              <div className="text-left">
                <h4 className="text-white font-bold text-base">Presensi Per Mata Pelajaran</h4>
                <p className="text-white/70 text-sm mt-0.5">Kelola kehadiran siswa per mapel</p>
              </div>
            </div>
            
            {/* Arrow with Animation */}
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:translate-x-1 transition-all duration-300">
              <TrendUpIcon size={20} />
            </div>
          </div>
          
          {/* Stats Preview */}
          <div className="relative flex items-center gap-3 mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <CheckCircleIcon size={14} />
              <span>6 Mapel Aktif</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <UsersIcon size={14} />
              <span>{totalStudents} Siswa</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <TrendUpIcon size={14} />
              <span>{attendancePercentage}%</span>
            </div>
          </div>
        </button>

          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon size={16} />
            </div>
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
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === 'analitik') navigate('/analitik');
        if (tab === 'riwayat') navigate('/kelola-presensi');
        if (tab === 'profil') navigate('/profil-guru');
      }} role="guru" />
    </div>
  );
}
