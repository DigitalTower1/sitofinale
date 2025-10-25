'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useId, useMemo } from 'react';
import { MagneticButton } from '../MagneticButton';
import clsx from 'clsx';

interface HeroCopyProps {
  reducedMotion: boolean;
}

const CTA_EASE = (t: number) => 1 - Math.pow(1 - t, 3);

const CTA_VARIANTS = {
  initial: { opacity: 0, y: 32, scale: 0.94 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: CTA_EASE } },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export function HeroCopy({ reducedMotion }: HeroCopyProps) {
  const statsId = useId();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 200, damping: 24, mass: 0.8 });
  const smoothY = useSpring(cursorY, { stiffness: 200, damping: 24, mass: 0.8 });
  const summaryId = `${statsId}-summary`;

  useEffect(() => {
    cursorX.set(-120);
    cursorY.set(-120);
  }, [cursorX, cursorY]);

  const titleLines = useMemo(
    () => [
      'Costruiamo esperienze digitali',
      'che scolpiscono il futuro dei brand di lusso'
    ],
    []
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.clientX - bounds.left);
    cursorY.set(event.clientY - bounds.top);
  };

  const handlePointerLeave = () => {
    if (reducedMotion) return;
    cursorX.set(-120);
    cursorY.set(-120);
  };

  return (
    <div
      className="hero-copy"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      <p className="hero-copy__eyebrow" data-hero-letter>
        Luxury Growth Atelier
      </p>
      <h1 id="hero-heading" className="hero-copy__title" aria-describedby={summaryId}>
        {titleLines.map((line, index) => (
          <span key={line} className={clsx('hero-copy__title-line', { 'hero-copy__title-line--accent': index === 1 })}>
            <span data-hero-letter data-parallax={index === 0 ? -16 : -22}>
              {line}
            </span>
          </span>
        ))}
      </h1>
      <p id={summaryId} className="hero-copy__lead" data-hero-letter data-parallax="-12">
        Disegniamo ecosistemi digitali immersivi con direzione artistica WebGL, strategie omnicanale e journey
        sartoriali che trasformano curiosi in clienti ambasciatori.
      </p>
      <motion.div
        className="hero-copy__actions"
        variants={CTA_VARIANTS}
        initial={reducedMotion ? 'enter' : 'initial'}
        animate="enter"
        whileHover="hover"
        whileTap="tap"
      >
        <MagneticButton as="a" href="/contact" variant="primary" data-hero-cta>
          Avvia il tuo progetto
        </MagneticButton>
        <MagneticButton as="a" href="/case-studies" variant="ghost" data-hero-cta>
          Guarda il portfolio
        </MagneticButton>
      </motion.div>
      <dl className="hero-copy__stats" aria-live="polite">
        <div className="hero-copy__stat" data-hero-letter>
          <dt>Incremento medio delle revenue</dt>
          <dd>+212%</dd>
        </div>
        <div className="hero-copy__stat" data-hero-letter>
          <dt>Time-to-experience medio</dt>
          <dd>12 settimane</dd>
        </div>
        <div className="hero-copy__stat" data-hero-letter>
          <dt>Immersive experiences consegnate</dt>
          <dd>34 progetti</dd>
        </div>
      </dl>
      {!reducedMotion && (
        <motion.div
          className="hero-copy__cursor"
          style={{ translateX: smoothX, translateY: smoothY }}
          aria-hidden
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 0.35, scale: 1, transition: { duration: 1.2, delay: 0.6, ease: 'easeOut' } }}
        />
      )}
    </div>
  );
}
