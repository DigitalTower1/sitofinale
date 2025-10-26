'use client';

import { useEffect, useState } from 'react';
import { useTowerStore } from './towerStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    title: 'Onboarding',
    description:
      'Introduzione magnetica con luce teal progressiva che accoglie l’utente e rivela la base della torre.'
  },
  {
    title: 'Strategia',
    description:
      'Luce orange e flare cinematici accompagnano i pillar strategici con elementi UI in parallasse.'
  },
  {
    title: 'Esperienza',
    description:
      'Micro-dolly verticale porta all’apice, scoprendo CTA principali e casi studio immersivi.'
  },
  {
    title: 'Contatto',
    description: 'Chiusura con glow soffice, form contatto e transizione graduale verso il carosello 3D.'
  }
];

export default function TowerPhases() {
  const [phase, setPhase] = useState(0);
  const storePhase = useTowerStore((state) => state.phase);

  useEffect(() => {
    setPhase(storePhase);
  }, [storePhase]);

  useEffect(() => {
    const handler = (event: Event) => {
      if ('detail' in event) {
        const detail = (event as CustomEvent<{ phase: number }>).detail;
        setPhase(detail.phase);
      }
    };
    window.addEventListener('tower-phase', handler as EventListener);
    return () => window.removeEventListener('tower-phase', handler as EventListener);
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('[data-phase-section]');
    const timelines: gsap.core.Timeline[] = [];

    sections.forEach((section, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: true,
          onEnter: () => setPhase(index),
          onEnterBack: () => setPhase(index),
          onToggle: ({ isActive }) => {
            if (isActive) {
              window.dispatchEvent(new CustomEvent('tower-phase', { detail: { phase: index } }));
            }
          }
        }
      });
      tl.to(section, { '--glow': 1, duration: 1.2, ease: 'power2.out' });
      timelines.push(tl);
    });

    return () => {
      timelines.forEach((tl) => tl.kill());
    };
  }, []);

  return (
    <div className="flex flex-col gap-12">
      {phases.map((item, index) => (
        <div
          key={item.title}
          data-phase-section
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-8 shadow-lg"
          style={{
            transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: index === phase ? 'translate3d(0,0,0)' : 'translate3d(0,40px,0)',
            boxShadow:
              index === phase
                ? '0 30px 120px rgba(28,181,189,0.25), 0 0 0 1px rgba(255,107,53,0.35)'
                : '0 20px 80px rgba(9,12,16,0.55)'
          }}
        >
          <div className="absolute inset-0 opacity-0" style={{ opacity: index === phase ? 0.6 : 0, transition: 'opacity 0.6s' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.4),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(28,181,189,0.35),transparent_60%)]" />
          </div>
          <div className="relative space-y-3">
            <span className="text-sm uppercase tracking-[0.35em] text-orange-300/70">Step {index + 1}</span>
            <h3 className="text-3xl font-semibold text-white">{item.title}</h3>
            <p className="max-w-2xl text-base text-slate-200/90">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
