import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/mockData";
import logoSMA from "@/assets/logo-sma-mayong.jpg";

interface UserHeaderProps {
  user: User;
  onLogout: () => void;
}

export function UserHeader({ user, onLogout }: UserHeaderProps) {
  const initials = user.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center overflow-hidden">
          <img src={logoSMA} alt="Logo SMAN 1 Mayong" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{user.nama}</h2>
          <p className="text-xs text-muted-foreground">
            {user.role === 'siswa' ? user.nis : user.nip} • {user.role === 'siswa' ? user.kelas : user.mapel}
          </p>
          <p className="text-xs text-primary font-medium">SMAN 1 MAYONG JEPARA</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Keluar
      </button>
    </div>
  );
}
