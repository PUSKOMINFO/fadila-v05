import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, User, BookOpen } from "lucide-react";
import { getCurrentUser, getAllSchedules, type User as UserType, type Schedule } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalMapel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeDay, setActiveDay] = useState(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = days[new Date().getDay()];
    return DAYS.includes(today) ? today : 'Senin';
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setSchedules(getAllSchedules(currentUser.kelas || 'Kelas 10A'));
  }, [navigate]);

  const filteredSchedules = schedules.filter(s => s.hari === activeDay);

  const getSubjectColor = (mapel: string) => {
    const colors: Record<string, string> = {
      'Matematika': 'bg-primary',
      'Bahasa Indonesia': 'bg-success',
      'Bahasa Inggris': 'bg-accent',
      'Fisika': 'bg-warning',
      'Kimia': 'bg-destructive',
      'Biologi': 'bg-success',
      'Sejarah': 'bg-amber-500',
      'PKN': 'bg-emerald-500',
      'Olahraga': 'bg-cyan-500',
      'Seni Budaya': 'bg-pink-500',
      'TIK': 'bg-indigo-500',
      'Agama': 'bg-teal-500',
      'Bahasa Jawa': 'bg-orange-500',
      'BK': 'bg-violet-500',
    };
    return colors[mapel] || 'bg-primary';
  };

  const handleNavChange = (tab: string) => {
    if (user?.role === 'siswa') {
      if (tab === 'beranda') navigate('/siswa');
      if (tab === 'riwayat') navigate('/riwayat');
      if (tab === 'profil') navigate('/profil');
    } else {
      if (tab === 'beranda') navigate('/guru');
      if (tab === 'analitik') navigate('/analitik');
      if (tab === 'riwayat') navigate('/kelola-presensi');
      if (tab === 'profil') navigate('/profil-guru');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-hero px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {user.role === 'siswa' ? 'Jadwal Mapel' : 'Jadwal Mengajar'}
            </h1>
            <p className="text-sm text-white/80">{user.role === 'siswa' ? user.kelas : user.mapel}</p>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-xl shadow-lg p-2 flex gap-1 overflow-x-auto">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                "flex-1 min-w-[60px] py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                activeDay === day
                  ? "gradient-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="px-4 py-6 space-y-3">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {/* Color Bar */}
                <div className={cn("w-1.5", getSubjectColor(schedule.mapel))} />
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{schedule.mapel}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-sm">{schedule.guru}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-primary font-medium">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{schedule.jamMulai}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        s/d {schedule.jamSelesai}
                      </p>
                    </div>
                  </div>
                  
                  {schedule.ruangan && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{schedule.ruangan}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Tidak Ada Jadwal</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tidak ada mata pelajaran pada hari {activeDay}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="beranda" 
        onTabChange={handleNavChange} 
        role={user.role} 
      />
    </div>
  );
}
