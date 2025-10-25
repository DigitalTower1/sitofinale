'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = progressRef.current;
    if (!element) return;

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY || document.documentElement.scrollTop;
      const value = max > 0 ? current / max : 0;
      element.style.setProperty('--scroll-progress', value.toString());
    };

    updateProgress();

    ScrollTrigger.addEventListener('refreshInit', updateProgress);
    ScrollTrigger.addEventListener('refresh', updateProgress);
    ScrollTrigger.addEventListener('scrollEnd', updateProgress);
    window.addEventListener('scroll', updateProgress);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', updateProgress);
      ScrollTrigger.removeEventListener('refresh', updateProgress);
    ScrollTrigger.removeEventListener('scrollEnd', updateProgress);
    window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return <div ref={progressRef} className="scroll-progress" aria-hidden />;
}
