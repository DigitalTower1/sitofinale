'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const studies = [
  {
    slug: 'aurum-atelier',
    title: 'Aurum Atelier',
    excerpt: 'Unrestored maison di alta gioielleria riposizionata con esperienza WebGL volumetrica e commerce 3D.',
    metrics: ['+126% tempo on-site', '+52% conversion rate']
  },
  {
    slug: 'veloce-motors',
    title: 'Veloce Motors',
    excerpt: 'Lancio hypercar elettrica con configuratore WebGPU, campagne omnicanale e lead scoring predittivo.',
    metrics: ['3.2x ROAS', '14 giorni time-to-launch']
  },
  {
    slug: 'palazzo-saffron',
    title: 'Palazzo Saffron',
    excerpt: 'Collezione hospitality ultra luxury con AR concierge e identità multisensoriale.',
    metrics: ['+89% richieste private', 'NPS 72']
  }
];

export function CaseStudiesSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cases__track',
        { xPercent: 15, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: {
            trigger: container.current,
            start: 'top 75%'
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={container} className="section cases" aria-labelledby="cases-heading">
      <div className="section__header">
        <p className="section__eyebrow">Case Studies</p>
        <h2 id="cases-heading" className="section__title">
          Esperienze che trasformano mercati.
        </h2>
        <p className="section__description">
          Collaboriamo con brand visionari per creare storie che restano. Ogni progetto è un ecosistema tra design, contenuti e
          performance.
        </p>
      </div>
      <div className="cases__track">
        {studies.map((caseStudy) => (
          <Link key={caseStudy.slug} href={`/case-studies/${caseStudy.slug}`} className="case-card">
            <div className="case-card__frame">
              <div className="case-card__image" aria-hidden />
            </div>
            <div className="case-card__body">
              <h3>{caseStudy.title}</h3>
              <p>{caseStudy.excerpt}</p>
              <ul>
                {caseStudy.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
