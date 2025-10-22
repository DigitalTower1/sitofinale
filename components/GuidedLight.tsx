'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

type SectionMeta = {
  el: HTMLElement;
};

export function GuidedLight() {
  const lightRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (!lightRef.current) return;

    const sections: SectionMeta[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-guided-section]')
    ).map((el) => ({ el }));

    if (sections.length === 0) return;

    let animationFrame = 0;

    const updateLight = () => {
      if (!lightRef.current) return;
      const viewportHeight = window.innerHeight || 1;

      let currentIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      const viewportCenter = viewportHeight / 2;

      sections.forEach((section, index) => {
        const rect = section.el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          currentIndex = index;
        }
      });

      const current = sections[currentIndex];
      const next = sections[Math.min(currentIndex + 1, sections.length - 1)];

      const assign = (prefix: string, element: SectionMeta) => {
        const rect = element.el.getBoundingClientRect();
        const heightRatio = Math.min(rect.height / viewportHeight, 1.4);
        const center = rect.top + rect.height / 2;
        const centerRatio = center / viewportHeight;
        lightRef.current?.style.setProperty(`--${prefix}-center`, `${centerRatio * 100}%`);
        lightRef.current?.style.setProperty(`--${prefix}-spread`, `${Math.max(60, heightRatio * 120)}%`);
      };

      assign('light-current', current);
      assign('light-next', next);
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateLight();
      });
    };

    updateLight();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    const observerSupported = typeof ResizeObserver !== 'undefined';
    const resizeObserver = observerSupported ? new ResizeObserver(scheduleUpdate) : null;
    if (resizeObserver) {
      sections.forEach((section) => resizeObserver.observe(section.el));
    }

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return <div ref={lightRef} className="guided-light" aria-hidden="true" />;
}
