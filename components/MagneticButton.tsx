'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ComponentPropsWithoutRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import clsx from 'clsx';

type ButtonBaseProps = ComponentPropsWithoutRef<'button'> & {
  as?: 'button';
};

type AnchorBaseProps = ComponentPropsWithoutRef<'a'> & {
  as: 'a';
};

type MagneticButtonProps = (ButtonBaseProps | AnchorBaseProps) & {
  variant?: 'primary' | 'ghost';
};

export function MagneticButton({ children, as = 'button', variant = 'primary', className, ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { reducedMotion } = useMotionPreferences();

  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * 0.2);
    y.set(offsetY * 0.2);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = (as === 'a' ? 'a' : 'button') as 'a' | 'button';
  const tagProps = (Tag === 'button' ? { type: 'button', ...rest } : rest) as any;

  return (
    <motion.div style={{ x: springX, y: springY }} className="magnetic-wrapper">
      <Tag
        {...tagProps}
        ref={ref as any}
        className={clsx('magnetic-btn', `magnetic-btn--${variant}`, className)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <span className="magnetic-btn__inner">{children}</span>
      </Tag>
    </motion.div>
  );
}
