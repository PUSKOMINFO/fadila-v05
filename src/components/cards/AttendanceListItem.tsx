import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AttendanceListItemProps {
  nama: string;
  nis: string;
  kelas: string;
  status: 'hadir' | 'terlambat' | 'tidak_hadir' | 'izin' | 'sakit';
  waktu?: string;
  avatar?: string;
}

export function AttendanceListItem({ nama, nis, kelas, status, waktu, avatar }: AttendanceListItemProps) {
  const initials = nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} alt={nama} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground text-sm">{nama}</p>
          <p className="text-xs text-muted-foreground">{nis} • {kelas}</p>
        </div>
      </div>
      <div className="text-right">
        <StatusBadge status={status} />
        {waktu && (
          <p className="text-xs text-muted-foreground mt-1">{waktu}</p>
        )}
      </div>
    </div>
  );
}
