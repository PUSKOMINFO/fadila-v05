import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardEdit, Calendar, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser, type User } from "@/lib/mockData";
import { BottomNav } from "@/components/layout/BottomNav";
import { toast } from "sonner";

interface CorrectionRequest {
  id: string;
  tanggal: string;
  alasan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function KoreksiPresensi() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tanggal, setTanggal] = useState('');
  const [jenisKoreksi, setJenisKoreksi] = useState('');
  const [alasan, setAlasan] = useState('');
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Load existing requests from localStorage
    const savedRequests = localStorage.getItem(`correction_requests_${currentUser.id}`);
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tanggal || !jenisKoreksi || !alasan.trim()) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRequest: CorrectionRequest = {
      id: Date.now().toString(),
      tanggal,
      alasan: `${jenisKoreksi}: ${alasan}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem(`correction_requests_${user?.id}`, JSON.stringify(updatedRequests));

    toast.success('Pengajuan koreksi berhasil dikirim');
    setTanggal('');
    setJenisKoreksi('');
    setAlasan('');
    setIsSubmitting(false);
  };

  const getStatusBadge = (status: CorrectionRequest['status']) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-destructive/10 text-destructive',
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

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
            <h1 className="text-xl font-bold">Koreksi Presensi</h1>
            <p className="text-sm text-white/80">Ajukan perbaikan data kehadiran</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Form */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardEdit className="w-5 h-5 text-primary" />
            Ajukan Koreksi
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Presensi</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tanggal"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="pl-10"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Koreksi</Label>
              <Select value={jenisKoreksi} onValueChange={setJenisKoreksi}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis koreksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tidak tercatat hadir">Tidak tercatat hadir</SelectItem>
                  <SelectItem value="Salah status (hadir/terlambat)">Salah status (hadir/terlambat)</SelectItem>
                  <SelectItem value="Waktu presensi salah">Waktu presensi salah</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alasan">Keterangan</Label>
              <Textarea
                id="alasan"
                placeholder="Jelaskan detail koreksi yang diajukan..."
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Mengirim...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pengajuan
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Request History */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Riwayat Pengajuan
          </h3>

          {requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {new Date(request.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{request.alasan}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Diajukan: {new Date(request.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">Belum Ada Pengajuan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Anda belum pernah mengajukan koreksi presensi
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="beranda"
        onTabChange={(tab) => {
          if (tab === 'beranda') navigate('/siswa');
          if (tab === 'riwayat') navigate('/riwayat');
          if (tab === 'profil') navigate('/profil');
        }}
        role="siswa"
      />
    </div>
  );
}
