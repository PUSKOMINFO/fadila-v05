import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { LiveClock } from "@/components/dashboard/LiveClock";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getCurrentUser, logout, getTodaySchedules, getUserAttendance, recordAttendance, type User, type AttendanceRecord } from "@/lib/mockData";
import { toast } from "sonner";
import {
  ScheduleIcon,
  DocumentIcon,
  LibraryIcon,
  BellIcon,
  ClipboardIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  BookIcon
} from "@/components/icons/FlatIcons";

export default function SiswaDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('beranda');
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Check today's attendance
    const attendance = getUserAttendance(currentUser.id);
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(a => a.tanggal === today);
    setTodayAttendance(todayRecord || null);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar');
    navigate('/');
  };

  const handlePresensi = () => {
    if (!user) return;
    
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Check if late (after 07:30)
    const isLate = hour > 7 || (hour === 7 && minute > 30);
    const status = isLate ? 'terlambat' : 'hadir';
    
    const record = recordAttendance(user.id, status);
    setTodayAttendance(record);
    
    if (isLate) {
      toast.warning('Presensi berhasil - Anda terlambat');
    } else {
      toast.success('Presensi berhasil!');
    }
  };

  if (!user) return null;

  const features = [
    { icon: <ScheduleIcon size={24} />, label: 'Jadwal Mapel', bgColor: 'purple' as const, iconBgColor: 'bg-primary', path: '/mapel' },
    { icon: <DocumentIcon size={24} />, label: 'Izin', bgColor: 'yellow' as const, iconBgColor: 'bg-warning', path: '/izin' },
    { icon: <LibraryIcon size={24} />, label: 'Perpustakaan', bgColor: 'green' as const, iconBgColor: 'bg-success', path: '/perpustakaan' },
    { icon: <BellIcon size={24} />, label: 'Pengumuman', bgColor: 'pink' as const, iconBgColor: 'bg-destructive', path: '/pengumuman' },
  ];

  const quickActions = [
    { icon: <ClipboardIcon size={20} />, label: 'Ajukan Koreksi Presensi', path: '/koreksi-presensi' },
    { icon: <CheckCircleIcon size={20} />, label: 'Lihat Presensi Mapel', path: '/presensi-mapel' },
  ];

  const todaySchedules = getTodaySchedules(user.kelas || '');

  const getAttendanceStatus = () => {
    if (!todayAttendance) return 'belum';
    return todayAttendance.status as 'hadir' | 'terlambat' | 'tidak_hadir';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <UserHeader user={user} onLogout={handleLogout} />

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Live Clock */}
        <LiveClock />

        {/* Today's Schedule */}
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            📚 Mata Pelajaran Hari Ini
          </h3>
          <div className="bg-card rounded-xl border border-border p-4">
            {todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {todaySchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{schedule.mapel}</p>
                      <p className="text-xs text-muted-foreground">{schedule.guru}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {schedule.jamMulai} - {schedule.jamSelesai}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BookIcon size={48} />
                <p className="font-medium text-foreground mt-3">Tidak Ada Jadwal Saat Ini</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tidak ada mata pelajaran yang sedang atau akan berlangsung
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Status */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Status Hari Ini</h3>
            <StatusBadge status={getAttendanceStatus()} />
          </div>
          
          {!todayAttendance ? (
            <Button
              onClick={handlePresensi}
              className="w-full gradient-success text-white font-medium py-5 rounded-xl"
            >
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Presensi Masuk
            </Button>
          ) : (
            <div className="bg-success/10 text-success rounded-xl p-4 text-center">
              <CheckCircleIcon size={32} />
              <p className="font-medium mt-2">Sudah Presensi</p>
              <p className="text-sm opacity-80">Waktu: {todayAttendance.waktuMasuk}</p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Fitur Siswa</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                label={feature.label}
                bgColor={feature.bgColor}
                iconBgColor={feature.iconBgColor}
                onClick={() => navigate(feature.path)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Aksi Cepat</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{action.icon}</span>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </div>
                <ChevronRightIcon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === 'riwayat') navigate('/riwayat');
        if (tab === 'profil') navigate('/profil');
      }} role="siswa" />
    </div>
  );
}
