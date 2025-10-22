'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '../MagneticButton';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const container = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta__content',
        { y: 40, opacity: 0, filter: 'blur(14px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%'
          }
        }
      );

      gsap.to('.cta__aurora', {
        backgroundPosition: '120% 40%',
        duration: 14,
        ease: 'none',
        repeat: -1
      });

      gsap.to('.cta__aurora', {
        opacity: 0.9,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="section cta"
      aria-labelledby="cta-heading"
      data-guided-section="cta"
    >
      <div className="cta__aurora" aria-hidden />
      <div className="cta__content card--carbon">
          <h2 id="cta-heading">Prenota la call strategica e proiettiamoci verso le 7 figures.</h2>
        <p>
          Allineiamo visione, dati e craft cinematografico per trasformare la tua idea nel prossimo brand iconico. Dal primo
          moodboard al monitoraggio continuo dei KPI condivisi.
        </p>
        <div className="cta__actions">
          <MagneticButton as="a" href="/contact" variant="primary">
            Prenota la strategic call
          </MagneticButton>
          <MagneticButton as="a" href="mailto:hello@digitaltower.agency" variant="ghost">
            Scrivici ora
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
