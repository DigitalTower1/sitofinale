'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroScene } from '../hero/HeroScene';
import { HeroCopy } from '../hero/HeroCopy';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const container = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const element = container.current;
    if (!element || reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .fromTo(
          '.hero-panel__letterbox',
          { scaleY: 1 },
          { scaleY: 0, duration: 1.2, stagger: 0.08, transformOrigin: 'center', ease: 'expo.inOut' }
        )
        .from(
          '.hero-copy__meta',
          { opacity: 0, y: 24, duration: 0.8 },
          '-=0.6'
        )
        .from(
          '.hero-copy__title-line span',
          {
            yPercent: 120,
            opacity: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'expo.out',
          },
          '-=0.7'
        )
        .from(
          ['.hero-copy__subtitle', '.hero-copy__actions', '.hero-copy__timeline', '.hero-copy__metrics'],
          { opacity: 0, y: 36, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
          '-=0.6'
        )
        .from(
          '.hero-panel__scroll-hint',
          { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

      gsap.to('.hero-panel__visual', {
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: '+=160%',
          scrub: true,
        },
        yPercent: 10,
        ease: 'none',
      });

      gsap.to('.hero-copy', {
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: '+=160%',
          scrub: true,
        },
        yPercent: -8,
        ease: 'none',
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel hero-panel"
      aria-labelledby="hero-heading"
      data-guided-section="hero"
      data-story-panel
    >
      <div className="hero-panel__backdrop" aria-hidden>
        <div className="hero-panel__texture hero-panel__texture--carbon" />
        <div className="hero-panel__texture hero-panel__texture--marble" />
      </div>
      <div className="hero-panel__content">
        <div className="hero-panel__visual">
          <HeroScene />
        </div>
        <div className="hero-panel__copy">
          <HeroCopy reducedMotion={reducedMotion} />
        </div>
      </div>
      <p className="hero-panel__scroll-hint" aria-hidden>
        Scroll
        <span>↓</span>
      </p>
      <div className="hero-panel__letterbox hero-panel__letterbox--top" aria-hidden />
      <div className="hero-panel__letterbox hero-panel__letterbox--bottom" aria-hidden />
    </section>
  );
}
