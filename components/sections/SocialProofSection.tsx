'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  {
    name: 'Shopify Plus Partner',
    description: 'Top 1% eCommerce experience architects',
    since: 'Dal 2020',
    tone: 'aurum'
  },
  {
    name: 'Meta Business Partner',
    description: 'Creative performance & paid social elite',
    since: 'Dal 2018',
    tone: 'noir'
  },
  {
    name: 'TikTok Marketing Partner',
    description: 'Storydoing realtime e commerce live',
    since: 'Dal 2021',
    tone: 'pulse'
  },
  {
    name: 'Google Premier Partner',
    description: 'AI + Search, YouTube & GMP orchestrazione',
    since: 'Dal 2017',
    tone: 'halo'
  }
];

const testimonial = {
  quote:
    '“Digital Tower ci ha guidati da zero a un fatturato 7 figure in 14 mesi, con una regia digitale che fonde brand experience e dati in tempo reale.”',
  author: 'Giada Morelli',
  role: 'Co-founder, Maison d’Héritage'
};

export function SocialProofSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.social-proof__partner');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%'
            },
            delay: index * 0.06
          }
        );
      });

      gsap.fromTo(
        '.social-proof__quote-block',
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.social-proof__quote-block',
            start: 'top 80%'
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={container} className="section social-proof" aria-labelledby="social-proof-heading">
      <div className="section__header">
        <p className="section__eyebrow">Alliances</p>
        <h2 id="social-proof-heading" className="section__title">
          Partnership certificate per scalare con fiducia.
        </h2>
        <p className="section__description">
          Siamo riconosciuti come partner élite dalle principali piattaforme. La nostra torre si costruisce su partnership
          provate, performance costanti e una regia integrata tra paid, owned ed earned media.
        </p>
      </div>
      <div className="social-proof__grid" role="list">
        {partners.map((partner) => (
          <article
            key={partner.name}
            role="listitem"
            className="social-proof__partner"
            data-tone={partner.tone}
            aria-label={`${partner.name} — ${partner.description}`}
          >
            <div className="social-proof__halo" aria-hidden />
            <p className="social-proof__since">{partner.since}</p>
            <h3>{partner.name}</h3>
            <p>{partner.description}</p>
          </article>
        ))}
      </div>
      <figure className="social-proof__quote-block">
        <blockquote>{testimonial.quote}</blockquote>
        <figcaption>
          <span>{testimonial.author}</span>
          <span>{testimonial.role}</span>
        </figcaption>
      </figure>
    </section>
  );
}
