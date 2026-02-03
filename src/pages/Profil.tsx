import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout, getUserAttendance, type User } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import {
  ArrowLeftIcon,
  MailIcon,
  GraduationCapIcon,
  UserCircleIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  LogOutIcon,
  BookIcon
} from "@/components/icons/FlatIcons";

export default function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [attendanceStats, setAttendanceStats] = useState({ total: 0, hadir: 0, rate: 0 });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setEditedUser(currentUser);

    // Calculate attendance stats
    const attendance = getUserAttendance(currentUser.id);
    const hadir = attendance.filter(a => a.status === 'hadir' || a.status === 'terlambat').length;
    setAttendanceStats({
      total: attendance.length,
      hadir,
      rate: attendance.length > 0 ? Math.round((hadir / attendance.length) * 100) : 0
    });
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar');
    navigate('/');
  };

  const handleSave = () => {
    if (!user) return;
    
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...editedUser };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ ...user, ...editedUser }));
      setUser({ ...user, ...editedUser } as User);
    }
    
    setIsEditing(false);
    toast.success('Profil berhasil diperbarui');
  };

  const handleCancel = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  if (!user) return null;

  const infoItems = [
    { 
      icon: <MailIcon size={16} />, 
      label: 'Email', 
      value: user.email,
      editable: false 
    },
    { 
      icon: user.role === 'siswa' ? <GraduationCapIcon size={16} /> : <BookIcon size={16} />, 
      label: user.role === 'siswa' ? 'NIS' : 'NIP', 
      value: user.role === 'siswa' ? user.nis : user.nip,
      editable: false 
    },
    { 
      icon: <UserCircleIcon size={16} />, 
      label: user.role === 'siswa' ? 'Kelas' : 'Mata Pelajaran', 
      value: user.role === 'siswa' ? user.kelas : user.mapel,
      editable: false 
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-cyan-500 px-4 pt-12 pb-20 text-white relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-xl font-bold">Profil</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <EditIcon size={20} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <XIcon size={20} />
              </button>
              <button
                onClick={handleSave}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              >
                <SaveIcon size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg p-6 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-card shadow-lg mx-auto -mt-18 overflow-hidden bg-muted">
            <img 
              src={user.avatar} 
              alt={user.nama}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          {isEditing ? (
            <Input
              value={editedUser.nama || ''}
              onChange={(e) => setEditedUser({ ...editedUser, nama: e.target.value })}
              className="text-center font-semibold mt-4"
            />
          ) : (
            <h2 className="text-xl font-semibold text-foreground mt-4">{user.nama}</h2>
          )}
          
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-medium mt-2",
            user.role === 'siswa' 
              ? "bg-primary/10 text-primary" 
              : "bg-accent/10 text-accent"
          )}>
            {user.role === 'siswa' ? 'Siswa' : 'Guru'}
          </span>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-foreground">{attendanceStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Hari</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{attendanceStats.hadir}</p>
              <p className="text-xs text-muted-foreground">Hadir</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{attendanceStats.rate}%</p>
              <p className="text-xs text-muted-foreground">Kehadiran</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 py-6 space-y-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <h3 className="font-semibold text-foreground p-4 border-b border-border">Informasi Akun</h3>
          <div className="divide-y divide-border">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <h3 className="font-semibold text-foreground p-4 border-b border-border">Pengaturan</h3>
          <div className="divide-y divide-border">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-destructive"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOutIcon size={20} />
              </div>
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">Aplikasi Presensi SMAN 1 Mayong</p>
          <p className="text-xs text-muted-foreground">Versi 1.0.0</p>
        </div>
      </div>

      <BottomNav activeTab="profil" onTabChange={(tab) => {
        if (tab === 'beranda') navigate('/siswa');
        if (tab === 'riwayat') navigate('/riwayat');
      }} role="siswa" />
    </div>
  );
}
