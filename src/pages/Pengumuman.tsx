import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pin, Calendar, User, Megaphone, BookOpen, PartyPopper, AlertCircle } from "lucide-react";
import { getCurrentUser, getAnnouncements, type User as UserType, type Announcement } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type CategoryType = 'semua' | 'umum' | 'akademik' | 'kegiatan' | 'penting';

export default function Pengumuman() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setAnnouncements(getAnnouncements());
  }, [navigate]);

  const filteredAnnouncements = announcements.filter(a => {
    if (activeCategory === 'semua') return true;
    return a.kategori === activeCategory;
  });

  const getCategoryIcon = (kategori: Announcement['kategori']) => {
    switch (kategori) {
      case 'penting': return <AlertCircle className="w-4 h-4" />;
      case 'akademik': return <BookOpen className="w-4 h-4" />;
      case 'kegiatan': return <PartyPopper className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  const getCategoryStyle = (kategori: Announcement['kategori']) => {
    switch (kategori) {
      case 'penting': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'akademik': return 'bg-primary/10 text-primary border-primary/20';
      case 'kegiatan': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryLabel = (kategori: Announcement['kategori']) => {
    switch (kategori) {
      case 'penting': return 'Penting';
      case 'akademik': return 'Akademik';
      case 'kegiatan': return 'Kegiatan';
      default: return 'Umum';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-destructive to-rose-500 px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Pengumuman</h1>
            <p className="text-sm text-white/80">Informasi terbaru dari sekolah</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-xl shadow-lg p-1.5 flex gap-1 overflow-x-auto">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'penting', label: 'Penting' },
            { id: 'akademik', label: 'Akademik' },
            { id: 'kegiatan', label: 'Kegiatan' },
            { id: 'umum', label: 'Umum' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-destructive text-white"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement List */}
      <div className="px-4 py-6 space-y-3">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <button
              key={announcement.id}
              onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
              className="w-full bg-card rounded-xl border border-border p-4 text-left shadow-sm hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                {announcement.pinned && (
                  <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Pin className="w-4 h-4 text-warning" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                      getCategoryStyle(announcement.kategori)
                    )}>
                      {getCategoryIcon(announcement.kategori)}
                      {getCategoryLabel(announcement.kategori)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{announcement.judul}</h3>
                </div>
              </div>

              {/* Content */}
              <p className={cn(
                "text-sm text-muted-foreground mt-3 transition-all",
                expandedId === announcement.id ? "" : "line-clamp-2"
              )}>
                {announcement.isi}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{announcement.author}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(announcement.tanggal)}</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Tidak Ada Pengumuman</p>
            <p className="text-sm text-muted-foreground mt-1">
              Belum ada pengumuman untuk kategori ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
