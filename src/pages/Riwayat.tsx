import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserAttendance, type User, type AttendanceRecord } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { 
  ArrowLeftIcon, 
  PresentIcon, 
  LateIcon, 
  AbsentIcon, 
  InfoIcon,
  ChevronRightIcon
} from "@/components/icons/FlatIcons";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Riwayat() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setAttendance(getUserAttendance(currentUser.id));
  }, [navigate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getAttendanceForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendance.find(a => a.tanggal === dateStr);
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir': return 'bg-success text-white';
      case 'terlambat': return 'bg-warning text-white';
      case 'tidak_hadir': return 'bg-destructive text-white';
      case 'izin': return 'bg-blue-500 text-white';
      case 'sakit': return 'bg-orange-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir': return <PresentIcon size={16} />;
      case 'terlambat': return <LateIcon size={16} />;
      case 'tidak_hadir': return <AbsentIcon size={16} />;
      case 'izin': 
      case 'sakit': return <InfoIcon size={16} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'terlambat': return 'Terlambat';
      case 'tidak_hadir': return 'Tidak Hadir';
      case 'izin': return 'Izin';
      case 'sakit': return 'Sakit';
      default: return '-';
    }
  };

  // Calculate statistics
  const monthlyAttendance = attendance.filter(a => {
    const date = new Date(a.tanggal);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const stats = {
    hadir: monthlyAttendance.filter(a => a.status === 'hadir').length,
    terlambat: monthlyAttendance.filter(a => a.status === 'terlambat').length,
    tidak_hadir: monthlyAttendance.filter(a => a.status === 'tidak_hadir').length,
    izin: monthlyAttendance.filter(a => a.status === 'izin').length,
    sakit: monthlyAttendance.filter(a => a.status === 'sakit').length,
  };

  const totalDays = stats.hadir + stats.terlambat + stats.tidak_hadir + stats.izin + stats.sakit;
  const attendanceRate = totalDays > 0 ? Math.round(((stats.hadir + stats.terlambat) / totalDays) * 100) : 0;

  const selectedAttendance = selectedDate 
    ? attendance.find(a => a.tanggal === selectedDate) 
    : null;

  if (!user) return null;

  // Generate calendar days
  const calendarDays = [];
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  
  for (let i = 0; i < totalCells; i++) {
    const day = i - firstDayOfMonth + 1;
    if (day > 0 && day <= daysInMonth) {
      calendarDays.push(day);
    } else {
      calendarDays.push(null);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-violet-600 px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Riwayat Presensi</h1>
            <p className="text-sm text-white/80">{user.kelas}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-white/20 rounded-xl p-2 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{stats.hadir}</p>
            <p className="text-[10px] text-white/80">Hadir</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{stats.terlambat}</p>
            <p className="text-[10px] text-white/80">Terlambat</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{stats.tidak_hadir}</p>
            <p className="text-[10px] text-white/80">Absen</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{stats.izin + stats.sakit}</p>
            <p className="text-[10px] text-white/80">Izin/Sakit</p>
          </div>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tingkat Kehadiran Bulan Ini</span>
            <span className="text-lg font-bold text-primary">{attendanceRate}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 py-6">
        <div className="bg-card rounded-xl border border-border p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h3 className="font-semibold text-foreground">
              {MONTHS[month]} {year}
            </h3>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square" />;
              }

              const att = getAttendanceForDate(day);
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative",
                    att ? getStatusColor(att.status) : "hover:bg-muted",
                    isToday && !att && "ring-2 ring-primary",
                    isSelected && "ring-2 ring-offset-2 ring-primary"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-xs text-muted-foreground">Hadir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-warning" />
              <span className="text-xs text-muted-foreground">Terlambat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span className="text-xs text-muted-foreground">Tidak Hadir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-xs text-muted-foreground">Izin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span className="text-xs text-muted-foreground">Sakit</span>
            </div>
          </div>
        </div>

        {/* Selected Date Detail */}
        {selectedDate && (
          <div className="bg-card rounded-xl border border-border p-4 mt-4">
            <h4 className="font-medium text-foreground mb-3">
              {new Date(selectedDate).toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h4>
            {selectedAttendance ? (
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  getStatusColor(selectedAttendance.status)
                )}>
                  {getStatusIcon(selectedAttendance.status)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{getStatusLabel(selectedAttendance.status)}</p>
                  {selectedAttendance.waktuMasuk && (
                    <p className="text-sm text-muted-foreground">Masuk: {selectedAttendance.waktuMasuk}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Tidak ada data presensi</p>
            )}
          </div>
        )}
      </div>

      <BottomNav activeTab="riwayat" onTabChange={(tab) => {
        if (tab === 'beranda') navigate('/siswa');
        if (tab === 'profil') navigate('/profil');
      }} role="siswa" />
    </div>
  );
}
