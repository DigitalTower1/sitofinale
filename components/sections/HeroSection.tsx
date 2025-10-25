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
    if (!element) return;
    const boxes = Array.from(element.querySelectorAll<HTMLElement>('.hero__letterbox'));
    boxes.forEach((box) => {
      if (reducedMotion) {
        box.style.display = 'none';
      } else {
        box.style.removeProperty('display');
      }
    });
  }, [reducedMotion]);

  useEffect(() => {
    const element = container.current;
    if (!element || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.set('.hero__letterbox', { transformOrigin: 'center' });
      tl.fromTo(
        '.hero__letterbox--top',
        { scaleY: 1, opacity: 1 },
        { scaleY: 0, duration: 1.4, ease: 'power2.inOut', delay: 0.1 }
      )
        .fromTo(
          '.hero__letterbox--bottom',
          { scaleY: 1, opacity: 1 },
          { scaleY: 0, duration: 1.4, ease: 'power2.inOut' },
          '<'
        )
        .from(
          '.hero-copy [data-hero-letter]',
          {
            yPercent: 110,
            opacity: 0,
            stagger: { amount: 0.8 },
            duration: 1.1,
            ease: 'power3.out'
          },
          '-=0.8'
        )
        .from(
          '.hero-copy__actions',
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
          },
          '-=0.6'
        )
        .fromTo(
          '.hero__scroll-hint',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        );

      gsap.to('.hero-copy [data-hero-letter]', {
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: '+=160%',
          scrub: 1.1
        },
        yPercent: (_, target) => {
          if (target instanceof HTMLElement) {
            const value = target.dataset.parallax;
            return value ? Number(value) : -18;
          }
          return -18;
        },
        ease: 'none'
      });

      gsap.to('.hero-copy', {
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: '+=160%',
          scrub: true
        },
        yPercent: -12,
        ease: 'none'
      });

      gsap.to('.hero-scene', {
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: '+=160%',
          scrub: true
        },
        yPercent: 8,
        ease: 'none'
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="section hero hero--immersive"
      aria-labelledby="hero-heading"
      data-guided-section="hero"
    >
      <div className="hero__background" aria-hidden>
        <HeroScene />
        <div className="hero__vignette" />
      </div>
      <div className="hero__content">
        <HeroCopy reducedMotion={reducedMotion} />
      </div>
      <p className="hero__scroll-hint" aria-hidden>
        Scroll <span aria-hidden>↓</span>
      </p>
      <div className="hero__letterbox hero__letterbox--top" aria-hidden />
      <div className="hero__letterbox hero__letterbox--bottom" aria-hidden />
    </section>
  );
}
