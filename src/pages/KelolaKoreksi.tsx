import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardEdit, Calendar, CheckCircle2, XCircle, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  getCurrentUser, 
  getAllCorrectionRequests, 
  updateCorrectionRequestStatus,
  type User, 
  type CorrectionRequest 
} from "@/lib/mockData";
import { BottomNav } from "@/components/layout/BottomNav";
import { toast } from "sonner";

export default function KelolaKoreksi() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catatanGuru, setCatatanGuru] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadRequests();
  }, [navigate]);

  const loadRequests = () => {
    setRequests(getAllCorrectionRequests());
  };

  const handleApprove = (requestId: string) => {
    if (!user) return;
    
    updateCorrectionRequestStatus(requestId, 'approved', user.id, catatanGuru || undefined);
    toast.success('Pengajuan koreksi disetujui');
    setCatatanGuru('');
    setExpandedId(null);
    loadRequests();
  };

  const handleReject = (requestId: string) => {
    if (!user) return;
    
    if (!catatanGuru.trim()) {
      toast.error('Mohon berikan alasan penolakan');
      return;
    }
    
    updateCorrectionRequestStatus(requestId, 'rejected', user.id, catatanGuru);
    toast.success('Pengajuan koreksi ditolak');
    setCatatanGuru('');
    setExpandedId(null);
    loadRequests();
  };

  const getStatusBadge = (status: CorrectionRequest['status']) => {
    const styles = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle2 className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const filteredRequests = requests.filter(r => 
    activeFilter === 'all' || r.status === activeFilter
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-hero px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Kelola Koreksi Presensi</h1>
            <p className="text-sm text-white/80">
              {pendingCount > 0 ? `${pendingCount} pengajuan menunggu` : 'Semua pengajuan telah diproses'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'pending', label: 'Menunggu' },
            { key: 'approved', label: 'Disetujui' },
            { key: 'rejected', label: 'Ditolak' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.key
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label}
              {filter.key === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Request List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                {/* Request Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{request.namaSiswa}</h4>
                      <p className="text-sm text-muted-foreground">{request.kelas}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {new Date(request.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <ClipboardEdit className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">{request.jenisKoreksi}</span>
                        <p className="text-muted-foreground">{request.alasan}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Diajukan: {new Date(request.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {request.catatanGuru && (
                    <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                        <MessageSquare className="w-4 h-4" />
                        Catatan Guru
                      </div>
                      <p className="text-sm text-foreground">{request.catatanGuru}</p>
                    </div>
                  )}
                </div>

                {/* Action Section for Pending */}
                {request.status === 'pending' && (
                  <div className="border-t border-border p-4 bg-muted/30">
                    {expandedId === request.id ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Tambahkan catatan (wajib untuk penolakan)..."
                          value={catatanGuru}
                          onChange={(e) => setCatatanGuru(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(request.id)}
                            className="flex-1 bg-success hover:bg-success/90 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Setujui
                          </Button>
                          <Button
                            onClick={() => handleReject(request.id)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Tolak
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setExpandedId(null);
                            setCatatanGuru('');
                          }}
                          className="w-full"
                        >
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setExpandedId(request.id)}
                        className="w-full"
                        variant="outline"
                      >
                        Tindak Lanjuti
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <ClipboardEdit className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Tidak Ada Pengajuan</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeFilter === 'all' 
                ? 'Belum ada pengajuan koreksi presensi' 
                : `Tidak ada pengajuan dengan status "${activeFilter}"`}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="beranda"
        onTabChange={(tab) => {
          if (tab === 'beranda') navigate('/guru');
          if (tab === 'analitik') navigate('/analitik');
          if (tab === 'riwayat') navigate('/riwayat-guru');
          if (tab === 'profil') navigate('/profil-guru');
        }}
        role="guru"
      />
    </div>
  );
}
