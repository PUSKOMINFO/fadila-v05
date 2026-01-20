import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="gradient-hero rounded-2xl p-6 text-white text-center shadow-lg">
      <div className="flex justify-center mb-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-wide">{formatTime(time)}</p>
      <p className="text-sm text-white/80 mt-2">{formatDate(time)}</p>
    </div>
  );
}
