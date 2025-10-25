'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  {
    name: 'Shopify Plus Partner',
    description: 'Experience architects per ecommerce ultra premium',
    since: 'Dal 2020',
    tone: 'aurum',
  },
  {
    name: 'Meta Business Partner',
    description: 'Creative performance & paid social elite',
    since: 'Dal 2018',
    tone: 'noir',
  },
  {
    name: 'TikTok Marketing Partner',
    description: 'Storydoing realtime e commerce live',
    since: 'Dal 2021',
    tone: 'pulse',
  },
  {
    name: 'Google Premier Partner',
    description: 'AI + Search, YouTube & GMP orchestrazione',
    since: 'Dal 2017',
    tone: 'halo',
  },
];

const testimonies = [
  {
    quote:
      '“Digital Tower ha creato un universo narrativo che ha trasformato la nostra manifattura in esperienza immersiva. Crescita a 7 figure mantenendo coerenza con il nostro heritage.”',
    author: 'Giada Morelli',
    role: 'Co-founder · Maison d’Héritage',
  },
  {
    quote:
      '“Processi fluidi, attenzione maniacale e risultati concreti. Il loro team orchestra tecnologia e creatività come una troupe cinematografica.”',
    author: 'Luca Ferri',
    role: 'CMO · Veloce Motors',
  },
];

export function SocialProofSection() {
  const container = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const section = container.current;
    const stack = stackRef.current;
    const quote = quoteRef.current;
    if (!section || !stack || !quote || reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(stack, { '--stack-progress': 0 });
      const cards = Array.from(stack.querySelectorAll<HTMLElement>('.alliances-panel__partner'));

      gsap.to(stack, {
        '--stack-progress': partners.length - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      gsap.to(cards, {
        y: (index) => (index % 2 === 0 ? -10 : 10),
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { amount: 1.8, repeat: -1 },
      });

      const swap = () => {
        const next = quote.dataset.active === '0' ? 1 : 0;
        quote.dataset.active = String(next);
        const items = quote.querySelectorAll<HTMLElement>('.alliances-panel__quote');
        items.forEach((item, index) => {
          if (index === Number(next)) {
            gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
          } else {
            gsap.to(item, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.in' });
          }
        });
      };

      gsap.timeline({ repeat: -1, repeatDelay: 4.4 }).to({}, { duration: 1, onComplete: swap });
    }, section);

    quote.dataset.active = '0';

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel alliances-panel"
      aria-labelledby="alliances-heading"
      data-guided-section="alliances"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="story-panel__header">
          <p className="story-panel__eyebrow">Capitolo · Alleanze</p>
          <h2 id="alliances-heading">Partner certificati e fiducia sul campo.</h2>
          <p className="story-panel__lead">
            Collaboriamo con piattaforme globali e brand visionari. Le certificazioni aprono porte, le testimonianze confermano
            il metodo.
          </p>
        </div>
        <div className="alliances-panel__layout">
          <div ref={stackRef} className="alliances-panel__stack">
            {partners.map((partner, index) => (
              <article
                key={partner.name}
                className={clsx('alliances-panel__partner', 'card--carbon')}
                data-tone={partner.tone}
                style={{ '--item-index': index } as CSSProperties}
              >
                <span className="alliances-panel__partner-since">{partner.since}</span>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
              </article>
            ))}
          </div>
          <div ref={quoteRef} className="alliances-panel__quotes" data-active="0">
            {testimonies.map((testimony) => (
              <figure key={testimony.author} className="alliances-panel__quote card--marble">
                <blockquote>{testimony.quote}</blockquote>
                <figcaption>
                  <strong>{testimony.author}</strong>
                  <span>{testimony.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
