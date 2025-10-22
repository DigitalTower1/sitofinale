'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const heroCase = {
  slug: 'aurum-atelier',
  title: 'Aurum Atelier',
  tagline: 'Inspirational Arc — dalle botteghe storiche a un impero digitale.',
  story: [
    {
      title: 'Inspire',
      copy:
        'Abbiamo raccontato la storia della maison con una regia WebGL ispirata alle installazioni immersive di Immersive Garden: camera dolly, luce volumetrica e materiali champagne.'
    },
    {
      title: 'Ignite',
      copy:
        'Abbiamo orchestrato campagne Meta + TikTok con storytelling magnetico, mentre un configuratore PBR ha reso tangibile la collezione bespoke.'
    },
    {
      title: 'Impact',
      copy:
        'Dashboard KPI in tempo reale: +3.8x revenue e +214% lead qualificati, mantenendo INP medio a 96ms su mobile premium.'
    }
  ],
  metrics: ['+3.8x revenue YoY', '98ms INP', '45 giorni go-live'],
  excerpt:
    'Case study flagship che dimostra come la nostra torre trasformi heritage in crescita esponenziale con motion e performance bilanciati.'
};

const supportingCases = [
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
        '.cases__hero',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: {
            trigger: '.cases__hero',
            start: 'top 80%'
          }
        }
      );

      gsap.utils.toArray<HTMLElement>('.cases__chapter').forEach((chapter, index) => {
        gsap.fromTo(
          chapter,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 85%'
            },
            delay: index * 0.08
          }
        );
      });

      gsap.fromTo(
        '.cases__supporting',
        { opacity: 0, xPercent: 8 },
        {
          opacity: 1,
          xPercent: 0,
          ease: 'power3.out',
          duration: 0.9,
          scrollTrigger: {
            trigger: '.cases__supporting',
            start: 'top 85%'
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
      <article className="cases__hero">
        <div className="cases__hero-visual" aria-hidden>
          <div className="cases__hero-gradient" />
          <div className="cases__hero-highlight">Immersive Garden inspired</div>
        </div>
        <div className="cases__hero-body">
          <p className="cases__hero-tagline">{heroCase.tagline}</p>
          <h3>{heroCase.title}</h3>
          <p>{heroCase.excerpt}</p>
          <ul className="cases__hero-metrics">
            {heroCase.metrics.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
          <div className="cases__chapters">
            {heroCase.story.map((chapter) => (
              <div key={chapter.title} className="cases__chapter">
                <span>{chapter.title}</span>
                <p>{chapter.copy}</p>
              </div>
            ))}
          </div>
          <Link href={`/case-studies/${heroCase.slug}`} className="cases__cta">
            Esplora il case completo
          </Link>
        </div>
      </article>
      <div className="cases__supporting">
        {supportingCases.map((caseStudy) => (
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
