import { cn } from "@/lib/utils";
import { HomeIcon, AnalyticsIcon, CalendarManageIcon, ProfileIcon, HistoryIcon } from "@/components/icons/FlatIcons";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'siswa' | 'guru';
}

export function BottomNav({ activeTab, onTabChange, role }: BottomNavProps) {
  const tabs = role === 'guru' 
    ? [
        { id: 'beranda', label: 'Beranda', icon: HomeIcon },
        { id: 'analitik', label: 'Analitik', icon: AnalyticsIcon },
        { id: 'riwayat', label: 'Kelola', icon: CalendarManageIcon },
        { id: 'profil', label: 'Profil', icon: ProfileIcon },
      ]
    : [
        { id: 'beranda', label: 'Beranda', icon: HomeIcon },
        { id: 'riwayat', label: 'Riwayat', icon: HistoryIcon },
        { id: 'profil', label: 'Profil', icon: ProfileIcon },
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
                  ? "bg-primary/10 scale-105" 
                  : "text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
              )}
            >
              <Icon size={22} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
