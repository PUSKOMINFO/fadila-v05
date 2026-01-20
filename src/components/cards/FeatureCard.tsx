import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  label: string;
  bgColor: 'purple' | 'yellow' | 'green' | 'pink' | 'blue' | 'cyan';
  iconBgColor: string;
  onClick?: () => void;
}

const bgColorMap = {
  purple: 'bg-feature-purple',
  yellow: 'bg-feature-yellow',
  green: 'bg-feature-green',
  pink: 'bg-feature-pink',
  blue: 'bg-feature-blue',
  cyan: 'bg-feature-cyan',
};

export function FeatureCard({ icon, label, bgColor, iconBgColor, onClick }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 w-full aspect-square",
        bgColorMap[bgColor]
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-white",
        iconBgColor
      )}>
        {icon}
      </div>
      <span className="text-xs font-medium text-foreground text-center">{label}</span>
    </button>
  );
}
