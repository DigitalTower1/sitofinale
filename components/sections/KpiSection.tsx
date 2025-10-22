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
    description: 'Accelerazione media su progetti full funnel (12 mesi).'
  },
  {
    label: 'Tempo di go-live',
    value: 45,
    suffix: 'gg',
    description: 'Dalla firma al primo touchpoint attivo per prodotti premium.'
  },
  {
    label: 'Incremento lead qualificati',
    value: 214,
    suffix: '%',
    description: 'Dato mediano su campagne orchestrate cross-channel.'
  },
  {
    label: 'INP mediano monitorato',
    value: 98,
    suffix: 'ms',
    description: 'Esperienze cinematiche senza rinunciare alle prestazioni.'
  }
];

function formatValue(metric: Metric, current: number) {
  const fixed = metric.suffix === 'x' ? current.toFixed(1) : Math.round(current);
  return `${metric.prefix ?? ''}${fixed}${metric.suffix ?? ''}`;
}

export function KpiSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.kpi__card');

      cards.forEach((card, index) => {
        const metric = metrics[index];
        if (!metric) return;

        gsap.fromTo(
          card,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%'
            }
          }
        );

        const valueEl = card.querySelector<HTMLElement>('.kpi__value');
        if (!valueEl) return;

        const counter = { value: 0 };

        gsap.fromTo(
          counter,
          { value: metric.value },
          {
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%'
            },
            onUpdate() {
              const formatted = formatValue(metric, counter.value);
              valueEl.textContent = formatted;
            },
            onComplete() {
              valueEl.textContent = formatValue(metric, metric.value);
            }
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={container} className="section kpi" aria-labelledby="kpi-heading">
      <div className="section__header">
        <p className="section__eyebrow">KPI Dashboard</p>
        <h2 id="kpi-heading" className="section__title">
          Dati che confermano l&apos;ascensione verso le 7 figures.
        </h2>
        <p className="section__description">
          Ogni progetto è monitorato con dashboard real time e modelli predittivi. I numeri qui sotto provengono dai casi premiati
          che hanno ispirato la torre.
        </p>
      </div>
      <div className="kpi__grid" role="list">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            role="listitem"
            className="kpi__card"
            data-value={metric.value}
            data-suffix={metric.suffix}
          >
            <div className="kpi__glow" aria-hidden />
            <h3>{metric.label}</h3>
            <span className="kpi__value" aria-live="polite">
              {metric.prefix ?? ''}
              {metric.suffix === 'x' ? '0.0' : '0'}
              {metric.suffix ?? ''}
            </span>
            <p>{metric.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
