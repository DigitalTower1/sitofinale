'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

type Chapter = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
};

const chapters: Chapter[] = [
  {
    id: 'origins',
    label: 'Capitolo 01',
    title: 'Art direction sartoriale',
    description:
      'Storyboard cinematografici, prototipi realtime e sound design coordinato. Ogni progetto nasce da moodboard tattili e ricerche materiche.',
    bullets: ['Creative research lab', 'Texturing carbon + marble', 'Micro-interazioni coreografate'],
  },
  {
    id: 'craft',
    label: 'Capitolo 02',
    title: 'Engineering orchestrato',
    description:
      'Pipeline Next.js, WebGL e automazioni AI. I team design e dev lavorano sullo stesso set, sincronizzando sprint e prove su schermo.',
    bullets: ['Design system vivente', 'Motion + accessibility', 'QA immersivo multi-device'],
  },
  {
    id: 'growth',
    label: 'Capitolo 03',
    title: 'Growth guidato dai dati',
    description:
      'Dashboard realtime, test creativi e modelli predittivi. Ogni lancio diventa un film con KPI condivisi e ottimizzazioni continue.',
    bullets: ['Analytics in real time', 'Campaign room condivisa', 'Learning loop continuo'],
  },
];

export function AboutSection() {
  const container = useRef<HTMLElement>(null);
  const chaptersRef = useRef<(HTMLLIElement | null)[]>([]);
  const { reducedMotion } = useMotionPreferences();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = container.current;
    if (!section) return;

    const items = chaptersRef.current.filter((item): item is HTMLLIElement => Boolean(item));
    if (!items.length) return;

    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              onEnter: () => setActiveIndex(index),
              onEnterBack: () => setActiveIndex(index),
            },
          }
        );
      });

      gsap.to('.about-panel__media', {
        rotateY: 12,
        rotateX: -6,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.about-panel__grid-dot', {
        backgroundPosition: '200% 50%',
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
      className="story-panel about-panel"
      aria-labelledby="about-heading"
      data-guided-section="about"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="about-panel__layout">
          <div className="about-panel__media" aria-hidden>
            <div className="about-panel__media-layer about-panel__media-layer--carbon" />
            <div className="about-panel__media-layer about-panel__media-layer--marble" />
            <div className="about-panel__grid-dot" />
          </div>
          <div className="about-panel__copy">
            <p className="about-panel__eyebrow">Chi siamo</p>
            <h2 id="about-heading">Uno studio-laboratorio tra materia e codice.</h2>
            <p className="about-panel__intro">
              Siamo registi digitali: uniamo art direction, 3D realtime e growth. Carbonio e marmo sono la metafora della nostra
              doppia anima, tecnica e sensoriale.
            </p>
            <ol className="about-panel__chapters">
              {chapters.map((chapter, index) => (
                <li
                  key={chapter.id}
                  ref={(node) => {
                    chaptersRef.current[index] = node;
                  }}
                  className={clsx('about-panel__chapter', { 'about-panel__chapter--active': activeIndex === index })}
                >
                  <span className="about-panel__chapter-label">{chapter.label}</span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                  <ul>
                    {chapter.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
