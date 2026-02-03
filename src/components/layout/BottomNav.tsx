import { Home, BarChart3, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'siswa' | 'guru';
}

export function BottomNav({ activeTab, onTabChange, role }: BottomNavProps) {
  const tabs = role === 'guru' 
    ? [
        { id: 'beranda', label: 'Beranda', icon: Home },
        { id: 'analitik', label: 'Analitik', icon: BarChart3 },
        { id: 'riwayat', label: 'Kelola', icon: Calendar },
        { id: 'profil', label: 'Profil', icon: User },
      ]
    : [
        { id: 'beranda', label: 'Beranda', icon: Home },
        { id: 'riwayat', label: 'Riwayat', icon: Calendar },
        { id: 'profil', label: 'Profil', icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
