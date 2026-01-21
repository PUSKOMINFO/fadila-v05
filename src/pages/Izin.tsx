import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCurrentUser, getUserLeaveRequests, createLeaveRequest, type User, type LeaveRequest } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Izin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Form state
  const [jenis, setJenis] = useState<'izin' | 'sakit'>('izin');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [alasan, setAlasan] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadRequests(currentUser.id);
  }, [navigate]);

  const loadRequests = (userId: string) => {
    setRequests(getUserLeaveRequests(userId));
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
      tanggalMulai,
      tanggalSelesai,
      jenis,
      alasan: alasan.trim()
    });

    toast.success('Pengajuan izin berhasil dikirim');
    loadRequests(user.id);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setJenis('izin');
    setTanggalMulai('');
    setTanggalSelesai('');
    setAlasan('');
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-warning to-amber-500 px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Pengajuan Izin</h1>
            <p className="text-sm text-white/80">Kelola izin dan sakit</p>
          </div>
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
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 -mt-4">
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
                  ? "bg-warning text-white"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="px-4 py-6 space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-card rounded-xl border border-border p-4 shadow-sm"
            >
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
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Belum Ada Pengajuan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Klik tombol + untuk mengajukan izin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
