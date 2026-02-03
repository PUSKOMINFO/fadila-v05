import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  label: string;
  bgColor: 'purple' | 'yellow' | 'green' | 'pink' | 'blue' | 'cyan';
  iconBgColor?: string;
  onClick?: () => void;
  badge?: number;
}

const bgColorMap = {
  purple: 'bg-feature-purple',
  yellow: 'bg-feature-yellow',
  green: 'bg-feature-green',
  pink: 'bg-feature-pink',
  blue: 'bg-feature-blue',
  cyan: 'bg-feature-cyan',
};

const iconBgMap = {
  purple: 'bg-[#9B51E0]/20',
  yellow: 'bg-[#F2994A]/20',
  green: 'bg-[#6FCF97]/20',
  pink: 'bg-[#EB5757]/20',
  blue: 'bg-[#5B8DEF]/20',
  cyan: 'bg-[#56CCF2]/20',
};

export function FeatureCard({ icon, label, bgColor, iconBgColor, onClick, badge }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 w-full aspect-square shadow-sm",
        bgColorMap[bgColor]
      )}
    >
      {/* Badge */}
      {badge && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center shadow-md">
          {badge > 9 ? '9+' : badge}
        </div>
      )}
      
      {/* Icon Container */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
        iconBgColor || iconBgMap[bgColor]
      )}>
        {icon}
      </div>
      
      {/* Label */}
      <span className="text-xs font-semibold text-foreground text-center leading-tight">{label}</span>
    </button>
  );
}
