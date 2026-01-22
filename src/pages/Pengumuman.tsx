import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pin, Calendar, User, Megaphone, BookOpen, PartyPopper, AlertCircle, Plus, Pencil, Trash2, X } from "lucide-react";
import { getCurrentUser, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, type User as UserType, type Announcement } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type CategoryType = 'semua' | 'umum' | 'akademik' | 'kegiatan' | 'penting';

export default function Pengumuman() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // CRUD Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  
  // Form states
  const [formJudul, setFormJudul] = useState('');
  const [formIsi, setFormIsi] = useState('');
  const [formKategori, setFormKategori] = useState<Announcement['kategori']>('umum');
  const [formPinned, setFormPinned] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadAnnouncements();
  }, [navigate]);

  const loadAnnouncements = () => {
    setAnnouncements(getAnnouncements());
  };

  const resetForm = () => {
    setFormJudul('');
    setFormIsi('');
    setFormKategori('umum');
    setFormPinned(false);
    setEditingAnnouncement(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (announcement: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAnnouncement(announcement);
    setFormJudul(announcement.judul);
    setFormIsi(announcement.isi);
    setFormKategori(announcement.kategori);
    setFormPinned(announcement.pinned || false);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (announcement: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(announcement);
    setIsDeleteConfirmOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formJudul.trim() || !formIsi.trim()) {
      toast.error('Lengkapi semua data');
      return;
    }

    if (editingAnnouncement) {
      // Update
      updateAnnouncement(editingAnnouncement.id, {
        judul: formJudul.trim(),
        isi: formIsi.trim(),
        kategori: formKategori,
        pinned: formPinned
      });
      toast.success('Pengumuman berhasil diperbarui');
    } else {
      // Create
      createAnnouncement({
        judul: formJudul.trim(),
        isi: formIsi.trim(),
        kategori: formKategori,
        author: user.nama,
        pinned: formPinned
      });
      toast.success('Pengumuman berhasil dibuat');
    }

    loadAnnouncements();
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    
    deleteAnnouncement(deleteTarget.id);
    toast.success('Pengumuman berhasil dihapus');
    loadAnnouncements();
    setIsDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

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

  const handleNavChange = (tab: string) => {
    if (user?.role === 'siswa') {
      if (tab === 'beranda') navigate('/siswa');
      if (tab === 'riwayat') navigate('/riwayat');
      if (tab === 'profil') navigate('/profil');
    } else {
      if (tab === 'beranda') navigate('/guru');
      if (tab === 'riwayat') navigate('/riwayat-guru');
      if (tab === 'profil') navigate('/profil-guru');
    }
  };

  if (!user) return null;

  const isGuru = user.role === 'guru';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className={cn(
        "px-4 pt-12 pb-6 text-white",
        isGuru ? "gradient-primary" : "bg-gradient-to-br from-destructive to-rose-500"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(isGuru ? '/guru' : '/siswa')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">
              {isGuru ? 'Kelola Pengumuman' : 'Pengumuman'}
            </h1>
            <p className="text-sm text-white/80">
              {isGuru ? 'Buat dan kelola pengumuman sekolah' : 'Informasi terbaru dari sekolah'}
            </p>
          </div>
          {isGuru && (
            <button
              onClick={openCreateForm}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Guru Stats */}
        {isGuru && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="text-lg font-bold">{announcements.length}</p>
              <p className="text-[10px] text-white/70">Total</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="text-lg font-bold">{announcements.filter(a => a.kategori === 'penting').length}</p>
              <p className="text-[10px] text-white/70">Penting</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="text-lg font-bold">{announcements.filter(a => a.kategori === 'akademik').length}</p>
              <p className="text-[10px] text-white/70">Akademik</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="text-lg font-bold">{announcements.filter(a => a.pinned).length}</p>
              <p className="text-[10px] text-white/70">Pinned</p>
            </div>
          </div>
        )}
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
                  ? isGuru ? "bg-primary text-primary-foreground" : "bg-destructive text-white"
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
            <div
              key={announcement.id}
              onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
              className="w-full bg-card rounded-xl border border-border p-4 text-left shadow-sm hover:shadow-md transition-all cursor-pointer"
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
                
                {/* Action buttons for Guru */}
                {isGuru && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => openEditForm(announcement, e)}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={(e) => openDeleteConfirm(announcement, e)}
                      className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )}
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
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Tidak Ada Pengumuman</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isGuru 
                ? 'Klik tombol + untuk membuat pengumuman baru'
                : 'Belum ada pengumuman untuk kategori ini'}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Judul */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Judul</label>
              <Input
                placeholder="Masukkan judul pengumuman..."
                value={formJudul}
                onChange={(e) => setFormJudul(e.target.value)}
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Kategori</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'umum', label: 'Umum', color: 'bg-muted hover:bg-muted/80' },
                  { id: 'penting', label: 'Penting', color: 'bg-destructive/10 hover:bg-destructive/20 text-destructive' },
                  { id: 'akademik', label: 'Akademik', color: 'bg-primary/10 hover:bg-primary/20 text-primary' },
                  { id: 'kegiatan', label: 'Kegiatan', color: 'bg-success/10 hover:bg-success/20 text-success' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormKategori(cat.id as Announcement['kategori'])}
                    className={cn(
                      "py-2 px-2 rounded-lg text-xs font-medium transition-all border-2",
                      formKategori === cat.id 
                        ? "border-primary" 
                        : "border-transparent",
                      cat.color
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Isi */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Isi Pengumuman</label>
              <Textarea
                placeholder="Tulis isi pengumuman..."
                value={formIsi}
                onChange={(e) => setFormIsi(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Pin Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Sematkan di atas</span>
              </div>
              <Switch
                checked={formPinned}
                onCheckedChange={setFormPinned}
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-white py-5 rounded-xl">
              {editingAnnouncement ? 'Simpan Perubahan' : 'Buat Pengumuman'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Pengumuman?</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Pengumuman "<span className="font-medium text-foreground">{deleteTarget?.judul}</span>" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav 
        activeTab="beranda" 
        onTabChange={handleNavChange} 
        role={user.role} 
      />
    </div>
  );
}
