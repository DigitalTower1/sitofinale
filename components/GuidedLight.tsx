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
        const center = rect.top + rect.height / 2;
        const centerRatio = center / viewportHeight;
        const radius = Math.max(110, Math.min(170, rect.height * 0.48));
        const halo = Math.max(radius + 70, radius * 1.25);

        lightRef.current?.style.setProperty(`--${prefix}-center`, `${centerRatio * 100}%`);
        lightRef.current?.style.setProperty(`--${prefix}-radius`, `${radius}px`);
        lightRef.current?.style.setProperty(`--${prefix}-halo`, `${halo}px`);
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
