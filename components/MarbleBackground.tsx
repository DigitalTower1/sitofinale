'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export function MarbleBackground() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--pointer-norm-x', '0.5');
    root.style.setProperty('--pointer-norm-y', '0.5');
    root.style.setProperty('--pointer-x', '0px');
    root.style.setProperty('--pointer-y', '0px');

    return () => {
      root.style.removeProperty('--pointer-norm-x');
      root.style.removeProperty('--pointer-norm-y');
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, []);

  useEffect(() => {
    if (!fieldRef.current || reducedMotion) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const commitPointer = (clientX: number, clientY: number) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = Math.min(Math.max(clientX / innerWidth, 0), 1);
      const normalizedY = Math.min(Math.max(clientY / innerHeight, 0), 1);
      const root = document.documentElement;

      root.style.setProperty('--pointer-norm-x', normalizedX.toString());
      root.style.setProperty('--pointer-norm-y', normalizedY.toString());
      root.style.setProperty('--pointer-x', `${clientX}px`);
      root.style.setProperty('--pointer-y', `${clientY}px`);

      if (fieldRef.current) {
        const parallaxX = (normalizedX - 0.5) * 90;
        const parallaxY = (normalizedY - 0.5) * 90;
        fieldRef.current.style.setProperty('--marble-cell-shift-x', `${parallaxX}px`);
        fieldRef.current.style.setProperty('--marble-cell-shift-y', `${parallaxY}px`);
      }

      targetX = (normalizedX - 0.5) * 70;
      targetY = (normalizedY - 0.5) * 70;

      if (!raf) {
        raf = requestAnimationFrame(commit);
      }
    };

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

    const handlePointer = (event: PointerEvent) => {
      commitPointer(event.clientX, event.clientY);
    };

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        commitPointer(touch.clientX, touch.clientY);
      }
    };

    const handleResize = () => {
      commitPointer(window.innerWidth / 2, window.innerHeight / 2);
    };

    commitPointer(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('resize', handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div ref={fieldRef} className="marble-field" aria-hidden="true">
      <div className="marble-field__texture" />
      <div className="marble-field__cells" />
    </div>
  );
}
