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
      "bg-card rounded-xl p-4 border border-border shadow-sm",
      className
    )}>
      <div className="flex justify-center mb-2">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}
