'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { MagneticButton } from '../MagneticButton';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';
import { services as servicesData } from '../../content/services';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_TONES = ['pulse', 'glass', 'ignition', 'aether'] as const;

export function ServicesSection() {
  const container = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const orbit = orbitRef.current;
    const section = container.current;
    if (!orbit || !section || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(orbit, { '--carousel-rotation': 0 });

      gsap.to(orbit, {
        '--carousel-rotation': 360,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      gsap.to('.services-carousel__item', {
        y: (index) => Math.sin(index) * 12,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.12 },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel services-panel"
      aria-labelledby="services-heading"
      data-guided-section="services"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="story-panel__header">
          <p className="story-panel__eyebrow">Capitolo · Servizi</p>
          <h2 id="services-heading">Orchestriamo piattaforme esperienziali end-to-end.</h2>
          <p className="story-panel__lead">
            Ogni servizio è un laboratorio indipendente con team multi-disciplinare. Lavoriamo in cicli cinematici per
            guidare brand, prodotto e media in una stessa narrazione.
          </p>
        </div>
        <div className="services-panel__body">
          <div
            ref={orbitRef}
            className="services-carousel"
            style={{ '--item-count': servicesData.length } as CSSProperties}
          >
            {servicesData.map((service, index) => (
              <article
                key={service.id}
                className={clsx('services-carousel__item', 'card--carbon')}
                data-tone={SERVICE_TONES[index % SERVICE_TONES.length]}
                style={{ '--item-index': index } as CSSProperties}
              >
                <div className="services-carousel__tag">{service.title}</div>
                <p>{service.description}</p>
                <ul>
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
                <MagneticButton as="a" href={`/contact?topic=${service.id}`} variant="ghost">
                  Pianifica un deep dive
                </MagneticButton>
              </article>
            ))}
          </div>
          <div className="services-panel__caption">
            <p>
              Carosello ellittico 3D — ogni modulo evidenzia il tono creativo attraverso texture carbonio e accenti
              metallici. Ruota con lo scroll, reagisce al puntatore e mantiene focus su un solo card per volta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
