import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Users, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, BarChart3, PieChart } from "lucide-react";
import { getCurrentUser, getStudents, getAllAttendance, type User, type AttendanceRecord } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartPie, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Tooltip } from "recharts";

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];

export default function Analitik() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activeView, setActiveView] = useState<'mingguan' | 'bulanan'>('mingguan');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setStudents(getStudents());
    setAttendance(getAllAttendance());
  }, [navigate]);

  if (!user) return null;

  const totalStudents = students.length;
  
  // Calculate attendance stats
  const hadirCount = attendance.filter(a => a.status === 'hadir').length;
  const terlambatCount = attendance.filter(a => a.status === 'terlambat').length;
  const tidakHadirCount = attendance.filter(a => a.status === 'tidak_hadir' || a.status === 'sakit' || a.status === 'izin').length;
  const totalRecords = hadirCount + terlambatCount + tidakHadirCount;
  
  const attendanceRate = totalRecords > 0 ? Math.round(((hadirCount + terlambatCount) / totalRecords) * 100) : 0;
  const lateRate = totalRecords > 0 ? Math.round((terlambatCount / totalRecords) * 100) : 0;
  const absentRate = totalRecords > 0 ? Math.round((tidakHadirCount / totalRecords) * 100) : 0;

  // Weekly data for bar chart
  const weeklyData = DAYS.map((day, index) => {
    const dayRecords = attendance.filter((_, i) => i % 5 === index);
    const hadir = dayRecords.filter(a => a.status === 'hadir').length || Math.floor(Math.random() * 20) + 15;
    const terlambat = dayRecords.filter(a => a.status === 'terlambat').length || Math.floor(Math.random() * 5) + 1;
    const tidakHadir = dayRecords.filter(a => a.status === 'tidak_hadir').length || Math.floor(Math.random() * 3);
    return {
      day,
      hadir,
      terlambat,
      tidakHadir,
    };
  });

  // Pie chart data
  const pieData = [
    { name: 'Hadir', value: hadirCount || 75, color: 'hsl(var(--success))' },
    { name: 'Terlambat', value: terlambatCount || 15, color: 'hsl(var(--warning))' },
    { name: 'Tidak Hadir', value: tidakHadirCount || 10, color: 'hsl(var(--destructive))' },
  ];

  // Monthly trend data
  const monthlyTrend = [
    { week: 'Minggu 1', kehadiran: 92 },
    { week: 'Minggu 2', kehadiran: 88 },
    { week: 'Minggu 3', kehadiran: 95 },
    { week: 'Minggu 4', kehadiran: 91 },
  ];

  const statCards = [
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: 'Tingkat Kehadiran',
      value: `${attendanceRate}%`,
      trend: '+2.5%',
      trendUp: true,
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Tingkat Keterlambatan',
      value: `${lateRate}%`,
      trend: '-1.2%',
      trendUp: false,
      bgColor: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      label: 'Tingkat Ketidakhadiran',
      value: `${absentRate}%`,
      trend: '-0.8%',
      trendUp: false,
      bgColor: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Total Siswa',
      value: totalStudents.toString(),
      trend: '0',
      trendUp: true,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  // Top performers
  const topPerformers = students.slice(0, 5).map((student, index) => ({
    ...student,
    rate: 100 - index * 2,
  }));

  // Students needing attention
  const needsAttention = students.slice(-3).map((student, index) => ({
    ...student,
    rate: 70 - index * 5,
    issue: index === 0 ? 'Sering terlambat' : index === 1 ? 'Banyak absen' : 'Perlu perhatian',
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-hero px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/guru')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Analitik Kehadiran</h1>
            <p className="text-sm text-white/80">Statistik dan laporan presensi</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveView('mingguan')}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              activeView === 'mingguan'
                ? "bg-white text-primary"
                : "bg-white/20 text-white"
            )}
          >
            Mingguan
          </button>
          <button
            onClick={() => setActiveView('bulanan')}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              activeView === 'bulanan'
                ? "bg-white text-primary"
                : "bg-white/20 text-white"
            )}
          >
            Bulanan
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", stat.bgColor)}>
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              {stat.trend !== '0' && (
                <div className={cn(
                  "flex items-center gap-1 mt-2 text-xs font-medium",
                  stat.trendUp ? "text-success" : "text-destructive"
                )}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.trend} dari minggu lalu</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Kehadiran Mingguan</h3>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={2}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="hadir" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Hadir" />
                <Bar dataKey="terlambat" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Terlambat" />
                <Bar dataKey="tidakHadir" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Tidak Hadir" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Terlambat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Tidak Hadir</span>
            </div>
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Distribusi Kehadiran</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-40 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                </RechartPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        {activeView === 'bulanan' && (
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Tren Bulanan</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kehadiran" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    name="Kehadiran %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Performers */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">🏆 Siswa Terbaik</h3>
            <span className="text-xs text-muted-foreground">Kehadiran Tertinggi</span>
          </div>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  index === 0 ? "bg-yellow-500 text-white" :
                  index === 1 ? "bg-gray-400 text-white" :
                  index === 2 ? "bg-amber-600 text-white" :
                  "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{student.nama}</p>
                  <p className="text-xs text-muted-foreground">{student.kelas}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success text-sm">{student.rate}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">⚠️ Perlu Perhatian</h3>
            <span className="text-xs text-muted-foreground">Kehadiran Rendah</span>
          </div>
          <div className="space-y-3">
            {needsAttention.map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{student.nama}</p>
                  <p className="text-xs text-destructive">{student.issue}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive text-sm">{student.rate}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="analitik" 
        onTabChange={(tab) => {
          if (tab === 'beranda') navigate('/guru');
          if (tab === 'riwayat') navigate('/riwayat-guru');
          if (tab === 'profil') navigate('/profil-guru');
        }} 
        role="guru" 
      />
    </div>
  );
}
