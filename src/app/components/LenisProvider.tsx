'use client';

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

type MotionContextValue = {
  reduced: boolean;
};

const MotionContext = createContext<MotionContextValue>({ reduced: false });

export const useMotionPreferences = () => useContext(MotionContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const frame = useRef<number>();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
      document.body.dataset.lenis = 'disabled';
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      duration: 1.1
    });
    lenisRef.current = lenis;
    document.body.dataset.lenis = 'enabled';

    const update = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      frame.current = requestAnimationFrame(update);
    };

    frame.current = requestAnimationFrame(update);

    const sync = () => {
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (lenisRef.current && typeof value === 'number') {
            lenisRef.current.scrollTo(value, { immediate: true });
          }
          return lenisRef.current?.scroll ?? window.scrollY;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        }
      });
    };

    sync();
    ScrollTrigger.addEventListener('refresh', sync);
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
      ScrollTrigger.removeEventListener('refresh', sync);
    };
  }, [reduced]);

  usePointerSpotlight(reduced);

  const value = useMemo(() => ({ reduced }), [reduced]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

function usePointerSpotlight(reduced: boolean) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) {
      spotlightRef.current?.remove();
      return;
    }

    const el = document.createElement('div');
    spotlightRef.current = el;
    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.inset = '0';
    el.style.mixBlendMode = 'screen';
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0.75';
    el.style.background = 'radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%)';
    document.body.appendChild(el);

    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      el.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 48%)`;
    };

    const hide = () => {
      el.style.opacity = '0.35';
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('blur', hide);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', hide);
      el.remove();
    };
  }, [reduced]);
}
