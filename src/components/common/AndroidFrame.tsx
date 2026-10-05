import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light' | 'system';
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, theme = 'dark' }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Device Mode Switcher Floating Pill */}
      <div className="absolute top-2.5 right-3 z-50 flex items-center gap-1 bg-slate-900/90 border border-slate-800 text-xs rounded-full px-2.5 py-1 text-slate-300 shadow-xl backdrop-blur-md">
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition ${
            isPhoneFrame ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'hover:text-white'
          }`}
          title="Android Device View"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Phone</span>
        </button>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition ${
            !isPhoneFrame ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'hover:text-white'
          }`}
          title="Edge-to-Edge Responsive View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Full</span>
        </button>
      </div>

      {isPhoneFrame ? (
        /* Android Phone Frame Mockup */
        <div className="w-full max-w-[420px] h-[92vh] max-h-[880px] my-auto bg-slate-900 rounded-[44px] p-2.5 shadow-2xl shadow-indigo-950/50 border-[3px] border-slate-700/80 relative flex flex-col overflow-hidden ring-1 ring-white/10">
          {/* Outer hardware buttons mockup (Volume & Power) */}
          <div className="absolute -left-[5px] top-28 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
          <div className="absolute -left-[5px] top-44 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
          <div className="absolute -right-[5px] top-32 w-[3px] h-16 bg-slate-600 rounded-r-sm" />

          {/* Android Screen Container */}
          <div className="w-full h-full bg-slate-950 rounded-[36px] overflow-hidden flex flex-col relative border border-slate-800/60">
            {/* Android Status Bar */}
            <div className="w-full h-8 px-5 flex items-center justify-between text-[11px] font-medium text-slate-300 shrink-0 bg-transparent z-40 select-none">
              <span className="tracking-tight text-slate-200">{currentTime || '12:00'}</span>

              {/* Front Camera Punch Hole */}
              <div className="w-4 h-4 rounded-full bg-black ring-1 ring-slate-800/80 mx-auto flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-[1px] ring-indigo-500/30" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Application Screen Area */}
            <div className="flex-1 w-full overflow-hidden flex flex-col relative">
              {children}
            </div>

            {/* Android Navigation Gesture Pill Bar */}
            <div className="w-full h-4 shrink-0 flex items-center justify-center bg-transparent z-40">
              <div className="w-32 h-1 rounded-full bg-slate-500/40" />
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen View */
        <div className="w-full h-screen flex flex-col overflow-hidden bg-slate-950">
          {children}
        </div>
      )}
    </div>
  );
};
