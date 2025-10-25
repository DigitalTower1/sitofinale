'use client';

import { useEffect, useId, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import clsx from 'clsx';
import { MagneticButton } from '../MagneticButton';

interface HeroCopyProps {
  reducedMotion: boolean;
}

const CTA_VARIANTS = {
  initial: { opacity: 0, y: 42, scale: 0.94 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
  hover: { scale: 1.03, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] as const } },
  tap: { scale: 0.97, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const } },
};

export function HeroCopy({ reducedMotion }: HeroCopyProps) {
  const blockId = useId();
  const subtitleId = `${blockId}-subtitle`;
  const cursorX = useMotionValue(-140);
  const cursorY = useMotionValue(-140);
  const smoothX = useSpring(cursorX, { stiffness: 220, damping: 28, mass: 0.8 });
  const smoothY = useSpring(cursorY, { stiffness: 220, damping: 28, mass: 0.8 });

  useEffect(() => {
    cursorX.set(-140);
    cursorY.set(-140);
  }, [cursorX, cursorY]);

  const title = useMemo(
    () => [
      { text: 'Narrazioni immersive', accent: false, parallax: -16 },
      { text: 'per brand che cambiano il mondo', accent: true, parallax: -24 },
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
    cursorX.set(-140);
    cursorY.set(-140);
  };

  return (
    <div
      className="hero-copy"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      <p className="hero-copy__meta" data-hero-letter>
        Studio · Carbon x Marble Edition
      </p>
      <h1 id="hero-heading" className="hero-copy__title" aria-describedby={subtitleId}>
        {title.map((line) => (
          <span
            key={line.text}
            className={clsx('hero-copy__title-line', { 'hero-copy__title-line--accent': line.accent })}
          >
            <span data-hero-letter data-parallax={line.parallax}>
              {line.text}
            </span>
          </span>
        ))}
      </h1>
      <p id={subtitleId} className="hero-copy__subtitle" data-hero-letter data-parallax="-12">
        Mettiamo in scena esperienze a tutto schermo, combinando direzione artistica cinematografica, prototipi WebGL
        e strategie data-driven per trasformare l&apos;attenzione in relazione duratura.
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
          Prenota un incontro immersivo
        </MagneticButton>
        <MagneticButton as="a" href="/case-studies" variant="ghost" data-hero-cta>
          Vedi i reels progettuali
        </MagneticButton>
      </motion.div>
      <div className="hero-copy__timeline" data-hero-letter>
        <span>200+ scenari simulati</span>
        <span className="hero-copy__timeline-bar" aria-hidden />
        <span>Arte + Ingegneria</span>
      </div>
      <dl className="hero-copy__metrics" aria-live="polite">
        <div className="hero-copy__metric" data-hero-letter>
          <dt>Esperienze orchestrate</dt>
          <dd>47 launch</dd>
        </div>
        <div className="hero-copy__metric" data-hero-letter>
          <dt>Tempo medio prototipo</dt>
          <dd>8 settimane</dd>
        </div>
        <div className="hero-copy__metric" data-hero-letter>
          <dt>Indice di coinvolgimento</dt>
          <dd>+238%</dd>
        </div>
      </dl>
      {!reducedMotion && (
        <motion.div
          className="hero-copy__cursor"
          style={{ translateX: smoothX, translateY: smoothY }}
          aria-hidden
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 0.35, scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.6 } }}
        />
      )}
    </div>
  );
}
