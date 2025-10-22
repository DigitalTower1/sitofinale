'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export function MarbleBackground() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (!fieldRef.current || reducedMotion) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const commit = () => {
      if (!fieldRef.current) return;
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      fieldRef.current.style.setProperty('--marble-shift-x', `${currentX}px`);
      fieldRef.current.style.setProperty('--marble-shift-y', `${currentY}px`);
      if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(commit);
    };

    const setTargets = (clientX: number, clientY: number) => {
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 60;
      const y = (clientY / innerHeight - 0.5) * 60;
      targetX = x;
      targetY = y;
      if (!raf) {
        raf = requestAnimationFrame(commit);
      }
    };

    const handlePointer = (event: PointerEvent) => {
      setTargets(event.clientX, event.clientY);
    };

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        setTargets(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('touchmove', handleTouch);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return <div ref={fieldRef} className="marble-field" aria-hidden="true" />;
}
