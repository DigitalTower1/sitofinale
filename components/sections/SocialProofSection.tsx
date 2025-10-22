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

    const cleanups: Array<() => void> = [];
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

        const halo = card.querySelector<HTMLElement>('.social-proof__halo');
        if (halo) {
          gsap.to(halo, {
            scale: 1.18,
            opacity: 0.8,
            duration: 5.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
          });
        }
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

      gsap.to('.social-proof__quote-glow', {
        opacity: 0.65,
        scale: 1.1,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }, container);

    const cards = container.current.querySelectorAll<HTMLElement>('.social-proof__partner');
    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 600 });
      const halo = card.querySelector<HTMLElement>('.social-proof__halo');
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const translateZ = gsap.quickTo(card, 'z', { duration: 0.6, ease: 'power3.out' });

      const handleMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        rotateY((relX - 0.5) * 14);
        rotateX(-(relY - 0.5) * 10);
        translateZ(12);

        if (halo) {
          gsap.to(halo, {
            x: (relX - 0.5) * 40,
            y: (relY - 0.5) * 30,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        translateZ(0);
        if (halo) {
          gsap.to(halo, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
        }
      };

      card.addEventListener('pointermove', handleMove);
      card.addEventListener('pointerleave', reset);
      cleanups.push(() => {
        card.removeEventListener('pointermove', handleMove);
        card.removeEventListener('pointerleave', reset);
      });
    });

    return () => {
      cleanups.forEach((dispose) => dispose());
      ctx.revert();
    };
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
            <div className="social-proof__texture" aria-hidden />
            <p className="social-proof__since">{partner.since}</p>
            <h3>{partner.name}</h3>
            <p>{partner.description}</p>
          </article>
        ))}
      </div>
      <figure className="social-proof__quote-block">
        <div className="social-proof__quote-glow" aria-hidden />
        <blockquote>{testimonial.quote}</blockquote>
        <figcaption>
          <span>{testimonial.author}</span>
          <span>{testimonial.role}</span>
        </figcaption>
      </figure>
    </section>
  );
}
