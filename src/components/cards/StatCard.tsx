import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({ icon, value, label, iconColor = "text-primary", className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-3 border border-border shadow-sm",
      className
    )}>
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
      <p className="text-xs text-muted-foreground text-center">{label}</p>
    </div>
  );
}
