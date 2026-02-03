import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getStudents, getAllAttendance, type User, type AttendanceRecord } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartPie, Pie, Cell, LineChart, Line, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import {
  ArrowLeftIcon,
  PresentIcon,
  LateIcon,
  AbsentIcon,
  UsersIcon,
  TrendUpIcon,
  AnalyticsIcon,
  AlertIcon,
} from "@/components/icons/FlatIcons";
import { TrendingUp, TrendingDown, PieChart, Calendar, Target, Award, Clock, Users, BarChart3 } from "lucide-react";

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];

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

  // ============ WEEKLY DATA ============
  const weeklyData = DAYS.map((day, index) => {
    const dayRecords = attendance.filter((_, i) => i % 5 === index);
    const hadir = dayRecords.filter(a => a.status === 'hadir').length || Math.floor(Math.random() * 20) + 15;
    const terlambat = dayRecords.filter(a => a.status === 'terlambat').length || Math.floor(Math.random() * 5) + 1;
    const tidakHadir = dayRecords.filter(a => a.status === 'tidak_hadir').length || Math.floor(Math.random() * 3);
    return { day, hadir, terlambat, tidakHadir };
  });

  // Weekly pie data
  const weeklyPieData = [
    { name: 'Hadir', value: hadirCount || 75, color: 'hsl(var(--success))' },
    { name: 'Terlambat', value: terlambatCount || 15, color: 'hsl(var(--warning))' },
    { name: 'Tidak Hadir', value: tidakHadirCount || 10, color: 'hsl(var(--destructive))' },
  ];

  // Weekly stat cards
  const weeklyStatCards = [
    {
      icon: <PresentIcon size={24} />,
      label: 'Kehadiran Minggu Ini',
      value: `${attendanceRate}%`,
      trend: '+2.5%',
      trendUp: true,
      bgColor: 'bg-success/10',
      subLabel: 'vs minggu lalu'
    },
    {
      icon: <LateIcon size={24} />,
      label: 'Keterlambatan',
      value: `${lateRate}%`,
      trend: '-1.2%',
      trendUp: false,
      bgColor: 'bg-warning/10',
      subLabel: 'vs minggu lalu'
    },
    {
      icon: <Clock size={24} className="text-primary" />,
      label: 'Rata-rata Jam Masuk',
      value: '07:12',
      trend: '-3 menit',
      trendUp: true,
      bgColor: 'bg-primary/10',
      subLabel: 'lebih awal'
    },
    {
      icon: <Target size={24} className="text-accent" />,
      label: 'Target Tercapai',
      value: '4/5',
      trend: '80%',
      trendUp: true,
      bgColor: 'bg-accent/10',
      subLabel: 'hari kerja'
    },
  ];

  // Weekly insights
  const weeklyInsights = [
    { label: 'Hari terbaik', value: 'Selasa', detail: '98% kehadiran' },
    { label: 'Hari terburuk', value: 'Jumat', detail: '89% kehadiran' },
    { label: 'Total siswa hadir', value: '142', detail: 'dari 5 hari' },
  ];

  // ============ MONTHLY DATA ============
  const monthlyTrendData = MONTHS.map((month, index) => ({
    month,
    kehadiran: 85 + Math.floor(Math.random() * 12),
    terlambat: 5 + Math.floor(Math.random() * 8),
    absen: 3 + Math.floor(Math.random() * 5),
  }));

  // Monthly comparison with previous month
  const monthlyComparisonData = [
    { category: 'Hadir', bulanIni: 92, bulanLalu: 88 },
    { category: 'Terlambat', bulanIni: 5, bulanLalu: 8 },
    { category: 'Izin', bulanIni: 2, bulanLalu: 3 },
    { category: 'Sakit', bulanIni: 1, bulanLalu: 1 },
  ];

  // Monthly stat cards
  const monthlyStatCards = [
    {
      icon: <Calendar size={24} className="text-primary" />,
      label: 'Total Hari Aktif',
      value: '22',
      trend: '+2 hari',
      trendUp: true,
      bgColor: 'bg-primary/10',
      subLabel: 'vs bulan lalu'
    },
    {
      icon: <Users size={24} className="text-success" />,
      label: 'Rata-rata Kehadiran',
      value: '91%',
      trend: '+3.5%',
      trendUp: true,
      bgColor: 'bg-success/10',
      subLabel: 'vs bulan lalu'
    },
    {
      icon: <Award size={24} className="text-warning" />,
      label: 'Perfect Attendance',
      value: '8',
      trend: '+2 siswa',
      trendUp: true,
      bgColor: 'bg-warning/10',
      subLabel: 'siswa 100%'
    },
    {
      icon: <BarChart3 size={24} className="text-accent" />,
      label: 'Peningkatan',
      value: '+5.2%',
      trend: 'Naik',
      trendUp: true,
      bgColor: 'bg-accent/10',
      subLabel: 'tren positif'
    },
  ];

  // Monthly weekly breakdown
  const weeklyBreakdown = [
    { week: 'Minggu 1', hadir: 94, terlambat: 4, absen: 2, totalSiswa: 30 },
    { week: 'Minggu 2', hadir: 88, terlambat: 7, absen: 5, totalSiswa: 30 },
    { week: 'Minggu 3', hadir: 95, terlambat: 3, absen: 2, totalSiswa: 30 },
    { week: 'Minggu 4', hadir: 91, terlambat: 5, absen: 4, totalSiswa: 30 },
  ];

  // Monthly pie data - different focus (by class)
  const monthlyPieByClass = [
    { name: 'XII IPA 1', value: 96, color: 'hsl(var(--success))' },
    { name: 'XII IPA 2', value: 92, color: 'hsl(var(--primary))' },
    { name: 'XII IPS 1', value: 88, color: 'hsl(var(--warning))' },
    { name: 'XII IPS 2', value: 85, color: 'hsl(var(--accent))' },
  ];

  // Monthly summary
  const monthlySummary = [
    { label: 'Total Kehadiran', value: '612', detail: 'catatan presensi' },
    { label: 'Minggu Terbaik', value: 'Minggu 3', detail: '95% kehadiran' },
    { label: 'Siswa Bermasalah', value: '3', detail: 'perlu perhatian' },
    { label: 'Peringkat Kelas', value: 'XII IPA 1', detail: 'terbaik bulan ini' },
  ];

  // Top performers
  const topPerformers = students.slice(0, 5).map((student, index) => ({
    ...student,
    rate: 100 - index * 2,
    streak: 22 - index * 2,
  }));

  // Students needing attention
  const needsAttention = students.slice(-3).map((student, index) => ({
    ...student,
    rate: 70 - index * 5,
    issue: index === 0 ? 'Sering terlambat' : index === 1 ? 'Banyak absen' : 'Perlu perhatian',
    absences: 5 + index * 2,
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
            <ArrowLeftIcon size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Analitik Kehadiran</h1>
            <p className="text-sm text-white/80">
              {activeView === 'mingguan' ? 'Data minggu ini (27 Jan - 31 Jan 2025)' : 'Data bulan Januari 2025'}
            </p>
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
            📅 Mingguan
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
            📆 Bulanan
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        
        {/* ============ WEEKLY VIEW ============ */}
        {activeView === 'mingguan' && (
          <>
            {/* Weekly Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {weeklyStatCards.map((stat, index) => (
                <div key={index} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", stat.bgColor)}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-xs font-medium",
                    stat.trendUp ? "text-success" : "text-destructive"
                  )}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stat.trend} {stat.subLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Bar Chart */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AnalyticsIcon size={20} />
                  <h3 className="font-semibold text-foreground">Kehadiran per Hari</h3>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Minggu ini</span>
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

            {/* Weekly Distribution Pie */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Distribusi Status Minggu Ini</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-40 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPie>
                      <Pie
                        data={weeklyPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {weeklyPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPie>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {weeklyPieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium text-foreground ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Insights */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">📊 Insight Mingguan</h3>
              <div className="grid grid-cols-3 gap-3">
                {weeklyInsights.map((insight, index) => (
                  <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{insight.label}</p>
                    <p className="text-lg font-bold text-foreground mt-1">{insight.value}</p>
                    <p className="text-xs text-primary">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ============ MONTHLY VIEW ============ */}
        {activeView === 'bulanan' && (
          <>
            {/* Monthly Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {monthlyStatCards.map((stat, index) => (
                <div key={index} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", stat.bgColor)}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-xs font-medium",
                    stat.trendUp ? "text-success" : "text-destructive"
                  )}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stat.trend} {stat.subLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendUpIcon size={20} />
                  <h3 className="font-semibold text-foreground">Tren 6 Bulan Terakhir</h3>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Persentase</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[70, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="kehadiran" 
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success) / 0.2)"
                      strokeWidth={2}
                      name="Kehadiran %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Breakdown Table */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">📋 Breakdown per Minggu</h3>
              <div className="space-y-3">
                {weeklyBreakdown.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">{week.week}</p>
                      <p className="text-xs text-muted-foreground">{week.totalSiswa} siswa</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-success">{week.hadir}%</p>
                        <p className="text-muted-foreground">Hadir</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-warning">{week.terlambat}%</p>
                        <p className="text-muted-foreground">Telat</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-destructive">{week.absen}%</p>
                        <p className="text-muted-foreground">Absen</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Comparison Bar Chart */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <AnalyticsIcon size={20} />
                <h3 className="font-semibold text-foreground">Perbandingan Bulan Ini vs Lalu</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparisonData} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={70} />
                    <Tooltip />
                    <Bar dataKey="bulanIni" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Bulan Ini" />
                    <Bar dataKey="bulanLalu" fill="hsl(var(--muted-foreground) / 0.3)" radius={[0, 4, 4, 0]} name="Bulan Lalu" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-xs text-muted-foreground">Bulan Ini</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">Bulan Lalu</span>
                </div>
              </div>
            </div>

            {/* Kehadiran per Kelas */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Peringkat Kelas Bulan Ini</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-40 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPie>
                      <Pie
                        data={monthlyPieByClass}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {monthlyPieByClass.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPie>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {monthlyPieByClass.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.value}% kehadiran</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">📈 Ringkasan Bulanan</h3>
              <div className="grid grid-cols-2 gap-3">
                {monthlySummary.map((item, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                    <p className="text-xs text-primary">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Top Performers - Shared but with different context */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">🏆 Siswa Terbaik</h3>
            <span className="text-xs text-muted-foreground">
              {activeView === 'mingguan' ? 'Minggu ini' : 'Bulan ini'}
            </span>
          </div>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  index === 0 ? "bg-warning text-warning-foreground" :
                  index === 1 ? "bg-muted text-muted-foreground" :
                  index === 2 ? "bg-warning/70 text-warning-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{student.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.kelas} • {activeView === 'bulanan' ? `${student.streak} hari berturut` : 'Tepat waktu'}
                  </p>
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
            <span className="text-xs text-muted-foreground">
              {activeView === 'mingguan' ? 'Minggu ini' : `${needsAttention.reduce((a, s) => a + s.absences, 0)} total absen`}
            </span>
          </div>
          <div className="space-y-3">
            {needsAttention.map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertIcon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{student.nama}</p>
                  <p className="text-xs text-destructive">
                    {student.issue} {activeView === 'bulanan' && `• ${student.absences}x absen`}
                  </p>
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
          if (tab === 'riwayat') navigate('/kelola-presensi');
          if (tab === 'profil') navigate('/profil-guru');
        }} 
        role="guru" 
      />
    </div>
  );
}
