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
    const section = container.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-panel__content',
        { opacity: 0, y: 60, filter: 'blur(16px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      gsap.to('.cta-panel__halo', {
        rotate: 360,
        duration: 18,
        ease: 'none',
        repeat: -1,
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel cta-panel"
      aria-labelledby="cta-heading"
      data-guided-section="cta"
      data-story-panel
    >
      <div className="cta-panel__backdrop" aria-hidden>
        <div className="cta-panel__halo" />
        <div className="cta-panel__texture" />
      </div>
      <div className="story-panel__inner">
        <div className="cta-panel__content card--marble">
          <h2 id="cta-heading">Prenota una regia dedicata al tuo prossimo salto.</h2>
          <p>
            Mettiamo in sincrono strategia, produzione e tecnologia per lanciare esperienze che restano. Costruiamo insieme il
            prossimo capitolo, dalla concept room al debutto live.
          </p>
          <div className="cta-panel__actions">
            <MagneticButton as="a" href="/contact" variant="primary">
              Prenota la strategic call
            </MagneticButton>
            <MagneticButton as="a" href="mailto:hello@digitaltower.agency" variant="ghost">
              Scrivici ora
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
