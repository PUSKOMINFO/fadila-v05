import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users, GraduationCap, Phone, Mail, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/BottomNav";
import { getCurrentUser, getStudents, type User } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DaftarSiswa() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<string>('all');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setStudents(getStudents());
  }, [navigate]);

  if (!user) return null;

  // Get unique classes
  const kelasOptions = ['all', ...new Set(students.map(s => s.kelas).filter(Boolean))];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nis?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKelas = selectedKelas === 'all' || student.kelas === selectedKelas;
    return matchesSearch && matchesKelas;
  });

  // Group students by class
  const groupedStudents = filteredStudents.reduce((acc, student) => {
    const kelas = student.kelas || 'Tidak Ada Kelas';
    if (!acc[kelas]) acc[kelas] = [];
    acc[kelas].push(student);
    return acc;
  }, {} as Record<string, User[]>);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary text-white p-4 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/guru')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Daftar Siswa</h1>
            <p className="text-white/70 text-sm">Kelola data siswa</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-xs text-white/70">Total Siswa</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kelasOptions.length - 1}</p>
              <p className="text-xs text-white/70">Total Kelas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm"
          >
            <option value="all">Semua Kelas</option>
            {kelasOptions.filter(k => k !== 'all').map(kelas => (
              <option key={kelas} value={kelas}>{kelas}</option>
            ))}
          </select>
        </div>

        {/* Student List by Class */}
        {Object.entries(groupedStudents).sort().map(([kelas, siswaList]) => (
          <div key={kelas} className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Class Header */}
            <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{kelas}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {siswaList.length} siswa
              </Badge>
            </div>

            {/* Students */}
            <div className="divide-y divide-border">
              {siswaList.map((student, index) => (
                <div key={student.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-center w-8 text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </div>
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={student.avatar} alt={student.nama} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {student.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{student.nama}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">NIS: {student.nis}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
                      <Mail className="w-4 h-4 text-accent" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Tidak ada siswa ditemukan</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="beranda" 
        onTabChange={(tab) => {
          if (tab === 'beranda') navigate('/guru');
          if (tab === 'analitik') navigate('/analitik');
          if (tab === 'riwayat') navigate('/kelola-presensi');
          if (tab === 'profil') navigate('/profil-guru');
        }} 
        role="guru" 
      />
    </div>
  );
}
