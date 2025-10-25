'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CSSProperties } from 'react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: '1 · Immerse',
    description:
      'Analisi culturale, audit dati e definizione KPI. Creiamo il manifesto narrativo e la mappa emotiva del brand.',
  },
  {
    title: '2 · Architect',
    description:
      'Design system multisensoriale, storyboard cinematico e prototipi interattivi con iterazioni rapide.',
  },
  {
    title: '3 · Orchestrate',
    description:
      'Sviluppo Next.js/WebGL, pipeline contenuti, campagne media e automazioni con governance condivisa.',
  },
  {
    title: '4 · Amplify',
    description:
      'Monitoraggio in tempo reale, sperimentazioni creative, ottimizzazione continua e knowledge sharing.',
  },
];

export function ProcessSection() {
  const container = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const section = container.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      const nodes = Array.from(section.querySelectorAll<HTMLElement>('.process-panel__step'));
      const disposers: Array<() => void> = [];

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1.1,
        },
      }).to(section, { '--process-progress': nodes.length - 1, ease: 'none' });

      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 40, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 80%',
            },
          }
        );

        const handlePointerMove = (event: PointerEvent) => {
          const bounds = node.getBoundingClientRect();
          const relX = (event.clientX - bounds.left) / bounds.width;
          node.style.setProperty('--pointer-x', `${relX}`);
        };
        const handlePointerLeave = () => {
          node.style.removeProperty('--pointer-x');
        };
        node.addEventListener('pointermove', handlePointerMove);
        node.addEventListener('pointerleave', handlePointerLeave);
        disposers.push(() => {
          node.removeEventListener('pointermove', handlePointerMove);
          node.removeEventListener('pointerleave', handlePointerLeave);
        });
      });

      return () => {
        disposers.forEach((dispose) => dispose());
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel process-panel"
      aria-labelledby="process-heading"
      data-guided-section="process"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="story-panel__header">
          <p className="story-panel__eyebrow">Capitolo · Metodo</p>
          <h2 id="process-heading">Un percorso diretto come un film.</h2>
          <p className="story-panel__lead">
            Ogni fase ha un tono visivo, un ritmo e una metrica. Guidiamo team misti attraverso un workflow trasparente,
            collaborativo e profondamente umano.
          </p>
        </div>
        <div className="process-panel__timeline">
          <ol>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="process-panel__step card--carbon"
                style={{ '--step-index': index } as CSSProperties}
              >
                <span className="process-panel__marker" aria-hidden />
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="process-panel__rail" aria-hidden />
        </div>
      </div>
    </section>
  );
}
