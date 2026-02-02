import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, initializeMockData } from "@/lib/mockData";
import { toast } from "sonner";
import logoSMA from "@/assets/logo-sma-mayong.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru'>('siswa');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize mock data on first load
  useState(() => {
    initializeMockData();
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = login(email, password);

    if (user) {
      if (user.role !== activeTab) {
        toast.error(`Akun ini bukan akun ${activeTab === 'siswa' ? 'Siswa' : 'Guru'}`);
        setIsLoading(false);
        return;
      }
      toast.success(`Selamat datang, ${user.nama}!`);
      navigate(user.role === 'siswa' ? '/siswa' : '/guru');
    } else {
      toast.error('Email atau password salah');
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    if (activeTab === 'siswa') {
      setEmail('fadhila@siswa.sman1mayong.sch.id');
      setPassword('siswa123');
    } else {
      setEmail('sari.wulandari@guru.sman1mayong.sch.id');
      setPassword('guru123');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-hero px-6 pt-12 pb-16 text-center text-white">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden">
          <img src={logoSMA} alt="Logo SMAN 1 Mayong" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Presensi Digital</h1>
        <p className="text-white/80 text-sm">SMAN 1 Mayong Jepara</p>
      </div>

      {/* Login Card */}
      <div className="flex-1 -mt-8 px-4">
        <div className="bg-card rounded-2xl shadow-xl p-6 max-w-sm mx-auto">
          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('siswa')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'siswa'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Siswa
            </button>
            <button
              onClick={() => setActiveTab('guru')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guru'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              Guru
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={`Email ${activeTab === 'siswa' ? 'siswa' : 'guru'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-xs text-primary hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white font-medium py-5 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={fillDemoCredentials}
              className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Gunakan akun demo {activeTab === 'siswa' ? 'Siswa' : 'Guru'} →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-muted-foreground">
        <p>© 2026 SMAN 1 Mayong Jepara</p>
        <p className="mt-1">Sistem Presensi Digital</p>
      </div>
    </div>
  );
}
