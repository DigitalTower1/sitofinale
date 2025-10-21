'use client';

import { useEffect, type ReactNode } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export function MotionReduceBoundary({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const body = document.body;
    if (reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  return <>{children}</>;
}
