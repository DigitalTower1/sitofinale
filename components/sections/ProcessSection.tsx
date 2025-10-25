'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: '1. Ascend',
    description: 'Immersione strategica, data mining e definizione dei KPI di scalata. Mappiamo audience, insight e touchpoint.'
  },
  {
    title: '2. Architect',
    description: 'Design system, identità e architettura dell\'esperienza. Wireflow cinematico e prototipi motion first.'
  },
  {
    title: '3. Amplify',
    description: 'Sviluppo WebGL/WebGPU, campagne media, automazioni e ottimizzazione creativa con test multivariati.'
  },
  {
    title: '4. Elevate',
    description: 'Monitoraggio in tempo reale, modelli predittivi e refinement continuo basato su Web Vitals e ROI.'
  }
];

export function ProcessSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.process__line', {
        scaleY: 1,
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 1
        }
      });

      gsap.to('.process__aura', {
        backgroundPosition: '120% 40%',
        duration: 18,
        ease: 'none',
        repeat: -1
      });

      gsap.utils.toArray<HTMLElement>('.process__grid li').forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 32, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%'
            },
            delay: index * 0.1
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="section process"
      aria-labelledby="process-heading"
      data-guided-section="process"
    >
      <div className="section__header">
        <p className="section__eyebrow">Metodo</p>
        <h2 id="process-heading" className="section__title">
          Un percorso orchestrato per scalare.
        </h2>
      </div>
      <div className="process__grid">
        <div className="process__aura" aria-hidden />
        <div className="process__line" aria-hidden />
        <ul>
          {steps.map((step) => (
            <li key={step.title} className="process__step card--carbon">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
