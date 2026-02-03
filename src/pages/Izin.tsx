import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, FileText, CheckCircle2, XCircle, Clock, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCurrentUser, getUserLeaveRequests, getAllLeaveRequests, createLeaveRequest, updateLeaveRequestStatus, type User, type LeaveRequest } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Izin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for siswa
  const [jenis, setJenis] = useState<'izin' | 'sakit'>('izin');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [alasan, setAlasan] = useState('');
  
  // Form state for guru review
  const [catatanGuru, setCatatanGuru] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadRequests(currentUser);
  }, [navigate]);

  const loadRequests = (currentUser: User) => {
    if (currentUser.role === 'guru') {
      setRequests(getAllLeaveRequests());
    } else {
      setRequests(getUserLeaveRequests(currentUser.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!tanggalMulai || !tanggalSelesai || !alasan.trim()) {
      toast.error('Lengkapi semua data');
      return;
    }

    createLeaveRequest({
      userId: user.id,
      namaSiswa: user.nama,
      kelas: user.kelas || '',
      tanggalMulai,
      tanggalSelesai,
      jenis,
      alasan: alasan.trim()
    });

    toast.success('Pengajuan izin berhasil dikirim');
    loadRequests(user);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!selectedRequest || !user) return;

    updateLeaveRequestStatus(selectedRequest.id, status, user.id, catatanGuru.trim() || undefined);
    
    toast.success(status === 'approved' ? 'Pengajuan disetujui' : 'Pengajuan ditolak');
    loadRequests(user);
    setIsReviewDialogOpen(false);
    setSelectedRequest(null);
    setCatatanGuru('');
  };

  const resetForm = () => {
    setJenis('izin');
    setTanggalMulai('');
    setTanggalSelesai('');
    setAlasan('');
  };

  const filteredRequests = requests.filter(r => {
    const matchesTab = activeTab === 'all' || r.status === activeTab;
    const matchesSearch = user?.role === 'guru' 
      ? (r.namaSiswa || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesTab && matchesSearch;
  });

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusLabel = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return 'Menunggu';
    }
  };

  const getStatusBg = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-warning/10 text-warning';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
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
      if (tab === 'analitik') navigate('/analitik');
      if (tab === 'riwayat') navigate('/kelola-presensi');
      if (tab === 'profil') navigate('/profil-guru');
    }
  };

  if (!user) return null;

  // Stats for guru
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const isGuru = user.role === 'guru';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className={cn(
        "px-4 pt-12 pb-6 text-white",
        isGuru ? "gradient-primary" : "bg-gradient-to-br from-warning to-amber-500"
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
              {isGuru ? 'Kelola Izin Siswa' : 'Pengajuan Izin'}
            </h1>
            <p className="text-sm text-white/80">
              {isGuru ? 'Setujui atau tolak pengajuan izin' : 'Kelola izin dan sakit'}
            </p>
          </div>
          {!isGuru && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajukan Izin / Sakit</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {/* Type Selection */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setJenis('izin')}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-medium transition-all",
                        jenis === 'izin'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Izin
                    </button>
                    <button
                      type="button"
                      onClick={() => setJenis('sakit')}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-medium transition-all",
                        jenis === 'sakit'
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Sakit
                    </button>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Tanggal Mulai</label>
                      <Input
                        type="date"
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Tanggal Selesai</label>
                      <Input
                        type="date"
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Alasan</label>
                    <Textarea
                      placeholder="Jelaskan alasan izin/sakit..."
                      value={alasan}
                      onChange={(e) => setAlasan(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary text-white py-5 rounded-xl">
                    Kirim Pengajuan
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Guru Stats */}
        {isGuru && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-white/70">Menunggu</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-xs text-white/70">Disetujui</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-xs text-white/70">Ditolak</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search */}
      <div className="px-4 -mt-4 space-y-3">
        {/* Filter Tabs */}
        <div className="bg-card rounded-xl shadow-lg p-1.5 flex gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'approved', label: 'Disetujui' },
            { id: 'rejected', label: 'Ditolak' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? isGuru ? "bg-primary text-primary-foreground" : "bg-warning text-white"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search for Guru */}
        {isGuru && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      {/* Request List */}
      <div className="px-4 py-6 space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={cn(
                "bg-card rounded-xl border border-border p-4 shadow-sm transition-all",
                isGuru && request.status === 'pending' && "cursor-pointer hover:border-primary/50 hover:shadow-md"
              )}
              onClick={() => {
                if (isGuru && request.status === 'pending') {
                  setSelectedRequest(request);
                  setIsReviewDialogOpen(true);
                }
              }}
            >
              {/* Header with student info for guru */}
              {isGuru && (
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.namaSiswa || 'default'}`} />
                    <AvatarFallback>{(request.namaSiswa || 'S').split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{request.namaSiswa || 'Siswa'}</p>
                    <p className="text-xs text-muted-foreground">{request.kelas || '-'}</p>
                  </div>
                  {request.status === 'pending' && (
                    <span className="text-xs text-primary font-medium">Tap untuk review →</span>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    request.jenis === 'sakit' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  )}>
                    {request.jenis === 'sakit' ? 'Sakit' : 'Izin'}
                  </span>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  getStatusBg(request.status)
                )}>
                  {getStatusIcon(request.status)}
                  {getStatusLabel(request.status)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(request.tanggalMulai)}
                  {request.tanggalMulai !== request.tanggalSelesai && (
                    <> - {formatDate(request.tanggalSelesai)}</>
                  )}
                </span>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-foreground">{request.alasan}</p>
              </div>

              {/* Catatan guru if any */}
              {request.catatanGuru && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Catatan Guru:</p>
                      <p className="text-foreground">{request.catatanGuru}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">
              {isGuru ? 'Belum Ada Pengajuan Izin' : 'Belum Ada Pengajuan'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isGuru 
                ? 'Semua pengajuan izin siswa akan muncul di sini'
                : 'Klik tombol + untuk mengajukan izin'}
            </p>
          </div>
        )}
      </div>

      {/* Review Dialog for Guru */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Pengajuan Izin</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.namaSiswa || 'default'}`} />
                  <AvatarFallback>{(selectedRequest.namaSiswa || 'S').split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedRequest.namaSiswa || 'Siswa'}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.kelas || '-'}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jenis</span>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    selectedRequest.jenis === 'sakit' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  )}>
                    {selectedRequest.jenis === 'sakit' ? 'Sakit' : 'Izin'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tanggal</span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedRequest.tanggalMulai)}
                    {selectedRequest.tanggalMulai !== selectedRequest.tanggalSelesai && (
                      <> - {formatDate(selectedRequest.tanggalSelesai)}</>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Alasan</span>
                  <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedRequest.alasan}</p>
                </div>
              </div>

              {/* Catatan Guru */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Catatan (Opsional)
                </label>
                <Textarea
                  placeholder="Tambahkan catatan untuk siswa..."
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleReview('rejected')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90 text-white"
                  onClick={() => handleReview('approved')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Setujui
                </Button>
              </div>
            </div>
          )}
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
