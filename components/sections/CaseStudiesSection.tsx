'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';
import { caseStudies } from '../../content/case-studies';

gsap.registerPlugin(ScrollTrigger);

export function CaseStudiesSection() {
  const container = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = container.current;
    const rail = railRef.current;
    if (!section || !rail || reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(rail, { '--active-index': 0 });
      const slides = Array.from(rail.querySelectorAll<HTMLElement>('.portfolio-carousel__slide'));

      gsap.to(rail, {
        '--active-index': caseStudies.length - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1.1,
          onUpdate: (self) => {
            const next = Math.round(self.progress * (caseStudies.length - 1));
            setActiveIndex(next);
          },
        },
      });

      gsap.to(slides, {
        z: (index) => (index % 2 === 0 ? 12 : -12),
        rotationY: (index) => (index % 2 === 0 ? -6 : 6),
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { amount: 2.4, repeat: -1 },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel portfolio-panel"
      aria-labelledby="portfolio-heading"
      data-guided-section="portfolio"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="story-panel__header">
          <p className="story-panel__eyebrow">Capitolo · Portfolio</p>
          <h2 id="portfolio-heading">Case filmici e metriche tangibili.</h2>
          <p className="story-panel__lead">
            Una trilogia di progetti che mostra come il nostro studio fonde materiali, sound design e growth per generare
            impatto misurabile.
          </p>
        </div>
        <div className="portfolio-panel__stage">
          <div
            ref={railRef}
            className="portfolio-carousel"
            style={{ '--item-count': caseStudies.length } as CSSProperties}
          >
            {caseStudies.map((item, index) => (
              <article
                key={item.slug}
                className={clsx('portfolio-carousel__slide', 'card--marble')}
                data-active={activeIndex === index ? 'true' : 'false'}
                style={{ '--item-index': index } as CSSProperties}
              >
                <div className="portfolio-carousel__label">{`Capitolo 0${index + 1}`}</div>
                <h3>{item.title}</h3>
                <p className="portfolio-carousel__summary">{item.summary}</p>
                <p className="portfolio-carousel__challenge">{item.challenge}</p>
                <p className="portfolio-carousel__solution">{item.solution}</p>
                <ul className="portfolio-carousel__metrics">
                  {item.outcome.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <Link href={`/case-studies/${item.slug}`} className="portfolio-carousel__link">
                  Guarda il breakdown
                </Link>
              </article>
            ))}
          </div>
          <div className="portfolio-panel__legend">
            <p>
              Carosello "rack-focus": le card scorrono su una pista 3D con profondità variabile, mentre il contenuto attivo
              rimane in primo piano con luce mirata e texture marmorea.
            </p>
            <span className="portfolio-panel__progress" data-active-index={activeIndex + 1}>
              <span aria-hidden />
              <span aria-hidden />
              <span aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
