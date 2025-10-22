'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import clsx from 'clsx';

const Scene = dynamic(() => import('../3d/Scene').then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <HeroPoster isLoading />
});

function HeroPoster({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <div className={clsx('hero__poster', { 'hero__poster--loading': isLoading })}>
      <div className="hero__poster-gradient" />
    </div>
  );
}

export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setMounted(true);
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="hero__visual" aria-hidden>
      <div className="hero__visual-aura" aria-hidden />
      <div className="hero__visual-reflection" aria-hidden />
      {mounted && inView && !reducedMotion ? <Scene /> : <HeroPoster />}
    </div>
  );
}
