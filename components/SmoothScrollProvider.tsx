'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollContextValue {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export function useLenisInstance() {
  return useContext(SmoothScrollContext).lenis;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const frameRef = useRef<number | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      infinite: false
    });

    const root = document.documentElement;

    lenisRef.current = instance;

    const schedule = (fn: () => void) => {
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(fn);
      } else {
        Promise.resolve().then(fn).catch(() => fn());
      }
    };

    schedule(() => setLenis(instance));

    const update = (time: number) => {
      instance.raf(time);
      frameRef.current = window.requestAnimationFrame(update);
    };

    frameRef.current = window.requestAnimationFrame(update);

    const handleResize = () => {
      instance.resize();
    };

    const handleScrollUpdate = () => {
      ScrollTrigger.update();
    };

    instance.on('scroll', handleScrollUpdate);

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (typeof value === 'number') {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      fixedMarkers: true,
      pinType: document.body.style.transform ? 'transform' : 'fixed'
    });

    window.addEventListener('resize', handleResize);
    ScrollTrigger.addEventListener('refresh', handleResize);
    ScrollTrigger.defaults({ scroller: root });

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.removeEventListener('refresh', handleResize);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      instance.off('scroll', handleScrollUpdate);
      instance.destroy();
      ScrollTrigger.scrollerProxy(root, null as unknown as ScrollTrigger.Vars);
      lenisRef.current = null;
      frameRef.current = null;
      schedule(() => setLenis(null));
    };
  }, []);

  const value = useMemo(() => ({ lenis }), [lenis]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}
