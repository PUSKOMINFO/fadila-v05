import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'hadir' | 'terlambat' | 'tidak_hadir' | 'izin' | 'sakit' | 'belum';
  className?: string;
}

const statusConfig = {
  hadir: {
    label: 'Hadir',
    className: 'bg-success/10 text-success'
  },
  terlambat: {
    label: 'Terlambat',
    className: 'bg-warning/10 text-warning'
  },
  tidak_hadir: {
    label: 'Tidak Hadir',
    className: 'bg-destructive/10 text-destructive'
  },
  izin: {
    label: 'Izin',
    className: 'bg-primary/10 text-primary'
  },
  sakit: {
    label: 'Sakit',
    className: 'bg-accent/10 text-accent'
  },
  belum: {
    label: 'Belum Presensi',
    className: 'bg-muted text-muted-foreground'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
