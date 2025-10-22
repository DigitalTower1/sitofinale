'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero3D } from '../Hero3D';
import { MagneticButton } from '../MagneticButton';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;
    const heroEl = container.current;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero__title-line span', {
        yPercent: 110,
        opacity: 0,
        stagger: { amount: 0.6 },
        duration: 1.15,
        delay: 0.2
      })
        .from(
          '.hero__lead',
          {
            y: 28,
            opacity: 0,
            duration: 0.9
          },
          '-=0.7'
        )
        .from(
          '.hero__actions',
          {
            y: 24,
            opacity: 0,
            duration: 0.8
          },
          '-=0.6'
        )
        .from(
          '.hero__stats-item',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12
          },
          '-=0.4'
        )
        .from(
          '.hero__meta-card',
          {
            y: 30,
            opacity: 0,
            duration: 0.85
          },
          '-=0.5'
        );

      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          ScrollTrigger.create({
            trigger: container.current,
            start: 'top top',
            end: '+=120%',
            pin: '.hero__visual-stack',
            scrub: 1.1,
            anticipatePin: 1
          });
        }
      });

    }, container);

    const visual = heroEl.querySelector<HTMLElement>('.hero__visual');

    if (visual) {
      gsap.set(visual, { transformPerspective: 900 });
      const rotateX = gsap.quickTo(visual, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const rotateY = gsap.quickTo(visual, 'rotationY', { duration: 0.6, ease: 'power3.out' });

      const handleMove = (event: PointerEvent) => {
        const rect = visual.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        rotateY((relX - 0.5) * 14);
        rotateX(-(relY - 0.5) * 10);
      };

      const resetTilt = () => {
        rotateX(0);
        rotateY(0);
      };

      heroEl.addEventListener('pointermove', handleMove);
      heroEl.addEventListener('pointerleave', resetTilt);
      cleanups.push(() => {
        heroEl.removeEventListener('pointermove', handleMove);
        heroEl.removeEventListener('pointerleave', resetTilt);
      });
    }

    return () => {
      cleanups.forEach((dispose) => dispose());
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="section hero hero--immersive"
      aria-labelledby="hero-heading"
      data-guided-section="hero"
    >
      <div className="hero__grid">
        <div className="hero__intro">
          <p className="hero__eyebrow">Luxury Growth Atelier</p>
          <h1 id="hero-heading" className="hero__title">
            <span className="hero__title-line">
              <span>Costruiamo esperienze</span>
            </span>
            <span className="hero__title-line hero__title-line--accent">
              <span>iconiche per marchi visionari</span>
            </span>
          </h1>
          <p className="hero__lead">
            Strategie su misura, art direction immersiva e interazioni tridimensionali per elevare il valore percepito del tuo
            brand di lusso in ogni touchpoint digitale.
          </p>
          <div className="hero__actions" role="group" aria-label="Azioni principali">
            <MagneticButton as="a" href="/contact" variant="primary">
              Avvia il tuo progetto
            </MagneticButton>
            <MagneticButton as="a" href="/case-studies" variant="ghost">
              Guarda il portfolio
            </MagneticButton>
          </div>
          <dl className="hero__stats">
            <div className="hero__stats-item">
              <dt>Incremento medio delle revenue</dt>
              <dd>+212%</dd>
            </div>
            <div className="hero__stats-item">
              <dt>Tempo medio di go-live</dt>
              <dd>12 settimane</dd>
            </div>
            <div className="hero__stats-item">
              <dt>Esperienze immersive lanciate</dt>
              <dd>34 progetti</dd>
            </div>
          </dl>
        </div>
        <div className="hero__visual-stack">
          <Hero3D />
          <aside className="hero__meta-card">
            <p className="hero__meta-eyebrow">Torre parametica 2024</p>
            <p className="hero__meta-copy">
              Un&apos;architettura dinamica generata proceduralmente per rappresentare crescita, precisione e calore artigianale.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
