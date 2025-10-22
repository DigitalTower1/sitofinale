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
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={container} className="section services" aria-labelledby="services-heading">
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
          <article key={service.id} id={service.id} className={clsx('service-card')} data-tone={service.tone}>
            <div className="service-card__halo" aria-hidden />
            <p className="service-card__tagline">{service.tagline}</p>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <MagneticButton as="a" href={`/contact?topic=${service.id}`} variant="ghost" aria-label={`Richiedi ${service.title}`}>
              Pianifica un consulto
            </MagneticButton>
          </article>
        ))}
      </div>
    </section>
  );
}
