'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
};

const metrics: Metric[] = [
  {
    label: 'Revenue lift medio',
    value: 3.8,
    suffix: 'x',
    description: 'Accelerazione media registrata su programmi omnicanale di 12 mesi.',
  },
  {
    label: 'Tempo di go-live',
    value: 45,
    suffix: 'gg',
    description: 'Dalla firma al primo touchpoint attivo su prodotti premium.',
  },
  {
    label: 'Incremento lead qualificati',
    value: 214,
    suffix: '%',
    description: 'Media mediana su campagne integrate con scenari motion-first.',
  },
  {
    label: 'INP mediano monitorato',
    value: 98,
    suffix: 'ms',
    description: 'Esperienze cinematiche senza rinunciare alla risposta interattiva.',
  },
];

export function KpiSection() {
  const container = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const section = container.current;
    if (!section || reducedMotion) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>('.metrics-panel__card'));

    const animations = cards.map((card) => {
      const metricValue = Number(card.dataset.metricValue ?? '0');
      const metricSuffix = card.dataset.metricSuffix ?? '';
      const metricPrefix = card.dataset.metricPrefix ?? '';
      const valueEl = card.querySelector<HTMLElement>('.metrics-panel__value');
      const counter = { value: 0 };

      return gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'bottom center',
          scrub: 0.6,
        },
      })
        .fromTo(
          card,
          { y: 60, opacity: 0, '--glow-progress': 0 },
          { y: 0, opacity: 1, '--glow-progress': 1, duration: 1, ease: 'power3.out' }
        )
        .to(counter, {
          value: metricValue,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate() {
            if (valueEl) {
              const display = metricSuffix === 'x' ? counter.value.toFixed(1) : Math.round(counter.value).toString();
              valueEl.textContent = `${metricPrefix}${display}${metricSuffix}`;
            }
          },
        }, 0);
    });

    const hoverHandlers = cards.map((card) => {
      const onPointerMove = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        const relX = (event.clientX - bounds.left) / bounds.width;
        const relY = (event.clientY - bounds.top) / bounds.height;
        gsap.to(card, {
          rotationX: -(relY - 0.5) * 8,
          rotationY: (relX - 0.5) * 12,
          duration: 0.6,
          ease: 'power3.out',
        });
        card.style.setProperty('--pointer-x', `${relX}`);
        card.style.setProperty('--pointer-y', `${relY}`);
      };
      const onLeave = () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out' });
      };
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onLeave);
      return () => {
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onLeave);
      };
    });

    return () => {
      animations.forEach((timeline) => timeline.kill());
      hoverHandlers.forEach((dispose) => dispose());
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel metrics-panel"
      aria-labelledby="metrics-heading"
      data-guided-section="metrics"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="story-panel__header">
          <p className="story-panel__eyebrow">Capitolo · Performance</p>
          <h2 id="metrics-heading">Metriche scolpite durante il viaggio.</h2>
          <p className="story-panel__lead">
            Dashboard proprietarie, modelli predittivi e osservabilità continua traducono la regia estetica in risultato
            misurabile.
          </p>
        </div>
        <div className="metrics-panel__grid" role="list">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              role="listitem"
              className="metrics-panel__card card--carbon"
              data-metric-value={metric.value}
              data-metric-suffix={metric.suffix ?? ''}
              data-metric-prefix={metric.prefix ?? ''}
            >
              <h3>{metric.label}</h3>
              <span className="metrics-panel__value" aria-live="polite">
                {metric.prefix ?? ''}
                {metric.suffix === 'x' ? '0.0' : '0'}
                {metric.suffix ?? ''}
              </span>
              <p>{metric.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
