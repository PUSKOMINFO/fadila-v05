import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SiswaDashboard from "./pages/SiswaDashboard";
import GuruDashboard from "./pages/GuruDashboard";
import JadwalMapel from "./pages/JadwalMapel";
import PresensiMapel from "./pages/PresensiMapel";
import Izin from "./pages/Izin";
import Perpustakaan from "./pages/Perpustakaan";
import Pengumuman from "./pages/Pengumuman";
import Riwayat from "./pages/Riwayat";
import Profil from "./pages/Profil";
import RiwayatGuru from "./pages/RiwayatGuru";
import ProfilGuru from "./pages/ProfilGuru";
import DaftarSiswa from "./pages/DaftarSiswa";
import Analitik from "./pages/Analitik";
import NotFound from "./pages/NotFound";
import { PWAInstallPrompt } from "./components/pwa/PWAInstallPrompt";
import { initializeMockData } from "./lib/mockData";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AppContent() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/siswa" element={<SiswaDashboard />} />
        <Route path="/guru" element={<GuruDashboard />} />
        <Route path="/jadwal" element={<JadwalMapel />} />
        <Route path="/mapel" element={<JadwalMapel />} />
        <Route path="/presensi-mapel" element={<PresensiMapel />} />
        <Route path="/izin" element={<Izin />} />
        <Route path="/perpustakaan" element={<Perpustakaan />} />
        <Route path="/pengumuman" element={<Pengumuman />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/riwayat-guru" element={<RiwayatGuru />} />
        <Route path="/profil-guru" element={<ProfilGuru />} />
        <Route path="/daftar-siswa" element={<DaftarSiswa />} />
        <Route path="/analitik" element={<Analitik />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <PWAInstallPrompt />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
