'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export function CursorAura() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const { reducedMotion } = useMotionPreferences();
  const springX = useSpring(x, { stiffness: 180, damping: 24 });
  const springY = useSpring(y, { stiffness: 180, damping: 24 });

  useEffect(() => {
    if (reducedMotion) return;

    const handler = (event: PointerEvent) => {
      x.set(event.clientX - 150);
      y.set(event.clientY - 150);
    };

    window.addEventListener('pointermove', handler, { passive: true });
    return () => window.removeEventListener('pointermove', handler);
  }, [reducedMotion, x, y]);

  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="cursor-aura"
      style={{ x: springX, y: springY }}
      aria-hidden
      role="presentation"
    />
  );
}
