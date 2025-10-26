'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useMotionPreferences } from './LenisProvider';

const CASES = [
  {
    title: 'Neon Skyscraper',
    summary: 'Installazione immersiva con volumetrie dinamiche e luci teal/orange sincronizzate.',
    href: '/portfolio/neon-skyscraper'
  },
  {
    title: 'Aurora Gateway',
    summary: 'Portale interattivo con atmosfera bokeh e micro-parallasse responsive.',
    href: '/portfolio/aurora-gateway'
  },
  {
    title: 'Cobalt Horizon',
    summary: 'Dashboard cinematico per il monitoraggio dati con resa filmica.',
    href: '/portfolio/cobalt-horizon'
  }
];

export default function ExperienceCarousel() {
  const { reduced } = useMotionPreferences();
  const [active, setActive] = useState(0);
  const direction = useRef<1 | -1>(1);
  const progressRef = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<number>();
  const progress = useRef(0);

  useEffect(() => {
    if (reduced) {
      progressRef.current.forEach((bar) => {
        if (bar) {
          bar.style.setProperty('--progress', active === parseInt(bar.dataset.index ?? '0', 10) ? '100%' : '0%');
        }
      });
      return;
    }

    const step = () => {
      progress.current += 0.005 * direction.current;
      if (progress.current >= 1 || progress.current <= 0) {
        direction.current *= -1;
        progress.current = Math.max(0, Math.min(1, progress.current));
        setActive((prev) => (direction.current > 0 ? (prev + 1) % CASES.length : (prev - 1 + CASES.length) % CASES.length));
      }

      progressRef.current.forEach((bar) => {
        if (!bar) return;
        const index = parseInt(bar.dataset.index ?? '0', 10);
        const isActive = index === active;
        const eased = isActive ? progress.current : 0;
        bar.style.setProperty('--progress', `${eased * 100}%`);
      });

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, reduced]);

  const cards = useMemo(() => CASES, []);

  return (
    <section className="relative w-full space-y-10">
      <header className="flex flex-col gap-3">
        <span className="text-sm uppercase tracking-[0.35em] text-orange-300/80">Selezione case study</span>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Carosello immersivo ping-pong</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((item, index) => (
          <article
            key={item.title}
            className={clsx(
              'group relative flex h-64 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg transition-all duration-500',
              index === active ? 'border-orange-400/60 shadow-orange-500/20' : 'opacity-70 hover:opacity-100'
            )}
            style={{
              transformStyle: 'preserve-3d',
              transform:
                index === active
                  ? 'perspective(1200px) rotateY(0deg) translateZ(20px)'
                  : 'perspective(1200px) rotateY(10deg) translateZ(0)',
              transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)'
            }}
          >
            <div className="flex flex-1 flex-col gap-3">
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-200/90">{item.summary}</p>
              <a
                href={item.href}
                className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition-transform duration-500 group-hover:translate-x-1"
              >
                Esplora →
              </a>
            </div>
            <div
              ref={(node) => {
                if (node) progressRef.current[index] = node;
              }}
              data-index={index}
              className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-white/10"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,107,53,0.8), rgba(28,181,189,0.8))',
                backgroundSize: 'var(--progress, 0%) 100%',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
