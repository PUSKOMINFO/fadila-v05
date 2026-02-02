import { useState, useEffect } from "react";
import { X, Download, Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoSMA from "@/assets/logo-sma-mayong.jpg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        return;
      }
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS install instructions after delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app was installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Error installing PWA:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={cn(
          "w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden",
          "animate-in slide-in-from-bottom-4 duration-500"
        )}
      >
        {/* Header with gradient */}
        <div className="gradient-primary p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg overflow-hidden">
              <img src={logoSMA} alt="Logo SMAN 1 Mayong" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-xl font-bold">Install Aplikasi</h2>
            <p className="text-white/80 text-sm mt-1">
              Akses lebih cepat langsung dari home screen
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Device icons */}
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Mobile</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Tablet className="w-6 h-6 text-success" />
              </div>
              <span className="text-xs text-muted-foreground">Tablet</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Desktop</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm text-foreground">Akses offline tanpa internet</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm text-foreground">Loading lebih cepat</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm text-foreground">Tampilan fullscreen seperti aplikasi native</span>
            </div>
          </div>

          {/* iOS Instructions */}
          {isIOS && (
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Cara Install di iPhone/iPad:</p>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Tap ikon <strong>Share</strong> di Safari (ikon kotak dengan panah ke atas)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Scroll ke bawah dan pilih <strong>"Add to Home Screen"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Tap <strong>"Add"</strong> untuk menambahkan ke home screen</span>
                </li>
              </ol>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDismiss}
            >
              Nanti Saja
            </Button>
            {!isIOS && deferredPrompt && (
              <Button
                className="flex-1 gradient-primary text-white border-0"
                onClick={handleInstall}
              >
                <Download className="w-4 h-4 mr-2" />
                Install Sekarang
              </Button>
            )}
            {isIOS && (
              <Button
                className="flex-1 gradient-primary text-white border-0"
                onClick={handleDismiss}
              >
                Mengerti
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
