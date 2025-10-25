'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutScene } from '../about/AboutScene';
import { AboutCopy } from '../about/AboutCopy';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';
import type { AboutChapter } from '../about/types';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS: AboutChapter[] = [
  {
    id: 'manifesto',
    label: 'Capitolo 01',
    title: 'Manifesto di bottega digitale',
    subtitle: 'Partiamo da concept cinematografici per costruire interazioni significative.',
    paragraphs: [
      'Connettiamo art direction, tecnologia e storytelling in un workflow olistico.',
      'Ogni progetto è diretto come un corto: moodboard, blocking, sound design e prototipi immersivi.'
    ],
    highlights: ['Direzione creativa | cross-mediale', 'Ricerca visiva continua | pipeline realtime'],
    visual: {
      palette: {
        background: '#05060c',
        accent: '#f0d7a4',
        ambient: '#1f2a40',
        fog: '#0b1020',
        fill: '#0f1723'
      },
      pattern: 'ripple',
      warp: 0.8,
      density: 1.6,
      elevation: 0.3,
      drift: 0.6
    }
  },
  {
    id: 'atelier',
    label: 'Capitolo 02',
    title: 'Atelier inter-disciplinare',
    subtitle: 'UX, CG e engineering orbitano nello stesso spazio creativo.',
    paragraphs: [
      'Coordiniamo design system, motion language e tool proprietari per team ibridi.',
      'Diamo priorità a processi trasparenti: daily desk, board condivisi, revisioni in tempo reale.'
    ],
    highlights: ['Pipeline condivisa | design x dev', 'Stack modulare | prototipi WebGL'],
    visual: {
      palette: {
        background: '#06070f',
        accent: '#8de1ff',
        ambient: '#1a2f3b',
        fog: '#08141f',
        fill: '#14212d'
      },
      pattern: 'helix',
      warp: 0.75,
      density: 1.1,
      elevation: 0.4,
      drift: 0.5
    }
  },
  {
    id: 'metodo',
    label: 'Capitolo 03',
    title: 'Metodo, ritmo, manutenzione',
    subtitle: 'Sistemi robusti, tool personalizzati e regia dell’esperienza end-to-end.',
    paragraphs: [
      'Blueprint tecnici, living design tokens e QA immersivi garantiscono consistenza.',
      'La nostra scrivania è un hub: Figma, Notion, Unreal, Blender, Pipeline CI/CD.'
    ],
    highlights: ['Continuous delivery | testing sensoriale', 'Knowledge base viva | onboarding guidato'],
    visual: {
      palette: {
        background: '#07090f',
        accent: '#f7a6ff',
        ambient: '#292338',
        fog: '#100b1a',
        fill: '#1a1524'
      },
      pattern: 'pillar',
      warp: 0.5,
      density: 1.3,
      elevation: 0.6,
      drift: 0.48
    }
  },
  {
    id: 'impatto',
    label: 'Capitolo 04',
    title: 'Impatto misurabile e poetico',
    subtitle: 'Performance e brand affinity convivono grazie a metriche live e regia sensoriale.',
    paragraphs: [
      'Monitoriamo attenzione, conversione e sentiment con dashboard su misura.',
      'Ogni rilascio è un reel: scoring sonoro, micro-copy, choreography di interazioni.'
    ],
    highlights: ['Analytics in real time | growth craft', 'Experience research | field studies'],
    visual: {
      palette: {
        background: '#04050a',
        accent: '#ffd38e',
        ambient: '#1d2d2f',
        fog: '#060b12',
        fill: '#11171f'
      },
      pattern: 'nebula',
      warp: 0.9,
      density: 1.4,
      elevation: 0.5,
      drift: 0.7
    }
  }
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { reducedMotion } = useMotionPreferences();
  const audioSrc = process.env.NEXT_PUBLIC_ABOUT_AUDIO_BED;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const elements = triggerRefs.current.filter(
      (node): node is HTMLElement => node instanceof HTMLElement
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-chapter-index'));
            setActiveIndex((prev) => (Number.isNaN(index) ? prev : index));
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: '-30% 0px -30%'
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const section = containerRef.current;
    if (!section) {
      return;
    }

    const ctx = gsap.context(() => {
      triggerRefs.current.forEach((element, index) => {
        if (!element) return;
        const chapter = CHAPTERS[index];
        if (!chapter) return;
        const lines = gsap.utils.toArray<HTMLElement>(
          `[data-about-chapter="${chapter.id}"] [data-about-line]`
        );
        if (!lines.length) {
          return;
        }
        gsap.set(lines, { yPercent: 110, opacity: 0, filter: 'blur(10px)' });
        gsap.to(lines, {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: 'top center',
            end: 'bottom center',
            once: true
          }
        });
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * CHAPTERS.length}`,
        snap: {
          snapTo: (value) => {
            const segments = CHAPTERS.length - 1;
            if (segments <= 0) return 0;
            const snapped = Math.round(value * segments) / segments;
            return snapped;
          },
          duration: { min: 0.4, max: 0.9 },
          ease: 'power1.inOut'
        },
        invalidateOnRefresh: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      className="section about"
      id="chi-siamo"
      aria-labelledby="about-heading"
      data-guided-section="about"
    >
      <div className="about__timeline" aria-hidden>
        {CHAPTERS.map((chapter, index) => (
          <div
            key={chapter.id}
            ref={(node) => {
              triggerRefs.current[index] = node;
            }}
            className="about__chapter-trigger"
            data-chapter-index={index}
          />
        ))}
      </div>
      <div className="about__sticky">
        <div className="about__split">
          <div className="about__media" aria-hidden>
            <AboutScene
              chapters={CHAPTERS}
              activeIndex={activeIndex}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          </div>
          <div className="about__narrative" role="region" aria-live="polite">
            <AboutCopy
              chapters={CHAPTERS}
              activeIndex={activeIndex}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>
      {audioSrc ? (
        <audio
          className="about__audio"
          src={audioSrc}
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Audio bed della sezione Chi Siamo"
        />
      ) : null}
    </section>
  );
}
