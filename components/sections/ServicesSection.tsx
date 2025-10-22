'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { MagneticButton } from '../MagneticButton';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 'social-media',
    title: 'Social Media Management',
    tagline: 'Pulse Orbit',
    description:
      'Editorial design, storytelling e performance per brand che vogliono dominare le conversazioni cross-platform.',
    tone: 'pulse'
  },
  {
    id: 'web-design',
    title: 'Web Design & Branding',
    tagline: 'Glass Atelier',
    description:
      'Sistemi di identità e siti WebGL/WebGPU tailor-made con performance enterprise e storytelling immersivo.',
    tone: 'glass'
  },
  {
    id: 'advertising',
    title: 'Advertising',
    tagline: 'Velocity Lab',
    description:
      'Media buying full funnel, motion ads cinematiche e ottimizzazione creativa guidata da AI first-party.',
    tone: 'ignition'
  },
  {
    id: 'seo',
    title: 'SEO',
    tagline: 'Signal Intelligence',
    description:
      'Architecture, contenuti e technical SEO con automazioni edge per scalare ranking e revenue organiche.',
    tone: 'aether'
  }
];

export function ServicesSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.service-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%'
            },
            delay: index * 0.08
          }
        );

        const texture = card.querySelector<HTMLElement>('.service-card__texture');
        if (texture) {
          gsap.to(texture, {
            backgroundPosition: '120% 80%',
            filter: 'contrast(140%)',
            duration: 16,
            ease: 'none',
            repeat: -1,
            delay: index * 0.35
          });
        }
      });
    }, container);

    const cards = container.current.querySelectorAll<HTMLElement>('.service-card');
    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 800 });
      const texture = card.querySelector<HTMLElement>('.service-card__texture');
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });

      const handleMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        rotateY((relX - 0.5) * 16);
        rotateX(-(relY - 0.5) * 12);

        if (texture) {
          gsap.to(texture, {
            backgroundPosition: `${50 + (relX - 0.5) * 40}% ${50 + (relY - 0.5) * 40}%`,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        if (texture) {
          gsap.to(texture, {
            backgroundPosition: '50% 50%',
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      };

      card.addEventListener('pointermove', handleMove);
      card.addEventListener('pointerleave', reset);
      cleanups.push(() => {
        card.removeEventListener('pointermove', handleMove);
        card.removeEventListener('pointerleave', reset);
      });
    });

    return () => {
      cleanups.forEach((dispose) => dispose());
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="section services"
      aria-labelledby="services-heading"
      data-guided-section="services"
    >
      <div className="section__header">
        <p className="section__eyebrow">Servizi Signature</p>
        <h2 id="services-heading" className="section__title">
          Strategia, design e media orchestrati con precisione.
        </h2>
        <p className="section__description">
          Ogni torre ha fondamenta solide. Creiamo ecosistemi digitali dove branding, media e contenuti lavorano all&apos;unisono.
        </p>
      </div>
      <div className="services__grid">
        {services.map((service) => (
          <article
            key={service.id}
            id={service.id}
            className={clsx('service-card', 'card--carbon')}
            data-tone={service.tone}
          >
            <div className="service-card__texture" aria-hidden />
            <p className="service-card__tagline">{service.tagline}</p>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <MagneticButton as="a" href={`/contact?topic=${service.id}`} variant="ghost" aria-label={`Richiedi ${service.title}`}>
              Pianifica un consulto
            </MagneticButton>
          </article>
        ))}
      </div>
      <span className="section__connector" aria-hidden="true" />
    </section>
  );
}
