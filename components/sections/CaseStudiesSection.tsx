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
    const cleanups: Array<() => void> = [];
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

      gsap.to('.cases__hero-gradient', {
        backgroundPosition: '120% 40%',
        duration: 18,
        ease: 'none',
        repeat: -1
      });

      gsap.to('.cases__hero-orb', {
        yPercent: -12,
        xPercent: 10,
        scale: 1.08,
        duration: 6.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      gsap.to('.case-card__flare', {
        opacity: 0.8,
        scale: 1.05,
        duration: 5.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.2
      });

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

    const heroVisual = container.current.querySelector<HTMLElement>('.cases__hero-visual');
    if (heroVisual) {
      gsap.set(heroVisual, { transformPerspective: 900 });
      const rotateX = gsap.quickTo(heroVisual, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const rotateY = gsap.quickTo(heroVisual, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const orb = heroVisual.querySelector<HTMLElement>('.cases__hero-orb');

      const handleMove = (event: PointerEvent) => {
        const rect = heroVisual.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        rotateY((relX - 0.5) * 18);
        rotateX(-(relY - 0.5) * 14);
        if (orb) {
          gsap.to(orb, {
            x: (relX - 0.5) * 60,
            y: (relY - 0.5) * 40,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        if (orb) {
          gsap.to(orb, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
        }
      };

      heroVisual.addEventListener('pointermove', handleMove);
      heroVisual.addEventListener('pointerleave', reset);
      cleanups.push(() => {
        heroVisual.removeEventListener('pointermove', handleMove);
        heroVisual.removeEventListener('pointerleave', reset);
      });
    }

    const cards = container.current.querySelectorAll<HTMLElement>('.case-card');
    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 700 });
      const flare = card.querySelector<HTMLElement>('.case-card__flare');
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });

      const handleMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        rotateY((relX - 0.5) * 12);
        rotateX(-(relY - 0.5) * 10);

        if (flare) {
          gsap.to(flare, {
            x: (relX - 0.5) * 50,
            y: (relY - 0.5) * 50,
            duration: 0.5,
            ease: 'power3.out'
          });
        }
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        if (flare) {
          gsap.to(flare, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
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
          <div className="cases__hero-noise" />
          <div className="cases__hero-orb" />
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
              <div className="case-card__flare" aria-hidden />
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
