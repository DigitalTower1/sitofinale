'use client';

import { useEffect, useState } from 'react';
import { usePerformanceStore } from './performanceStore';

export default function PerformanceOverlay() {
  const [profile, setProfile] = useState<'desktop' | 'mobile' | 'reduced'>('desktop');
  const { fps, tier } = usePerformanceStore((state) => state);

  useEffect(() => {
    const updateTier = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setProfile('reduced');
      } else if (window.innerWidth < 768) {
        setProfile('mobile');
      } else {
        setProfile('desktop');
      }
    };
    updateTier();
    window.addEventListener('resize', updateTier);
    return () => window.removeEventListener('resize', updateTier);
  }, []);

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-20 flex w-48 flex-col gap-2 rounded-2xl border border-white/10 bg-black/60 p-4 text-xs text-slate-200">
      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Profilo</span>
      <strong className="text-base text-white">{profile}</strong>
      <div className="flex items-center justify-between text-[11px] text-slate-300">
        <span>FPS</span>
        <span>{Math.round(fps)}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-300">
        <span>GPU Tier</span>
        <span>{tier}</span>
      </div>
    </div>
  );
}

