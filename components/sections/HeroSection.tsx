'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero3D } from '../Hero3D';
import { MagneticButton } from '../MagneticButton';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion || !container.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero__heading span', {
        yPercent: 120,
        opacity: 0,
        stagger: 0.08,
        duration: 1.1,
        delay: 0.25
      })
        .from(
          '.hero__copy',
          {
            y: 24,
            opacity: 0,
            duration: 0.8
          },
          '-=0.6'
        )
        .from(
          '.hero__cta-group',
          {
            y: 24,
            opacity: 0,
            duration: 0.8
          },
          '-=0.5'
        );

      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          ScrollTrigger.create({
            trigger: container.current,
            start: 'top top',
            end: '+=120%',
            pin: '.hero__visual',
            scrub: 1.2,
            anticipatePin: 1
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={container} className="section hero" aria-labelledby="hero-heading">
      <div className="hero__content">
        <p className="hero__eyebrow">Luxury Marketing Agency</p>
        <h1 id="hero-heading" className="hero__heading">
          <span>Digital</span> <span>Tower</span>
        </h1>
        <p className="hero__copy">
          Uniamo strategie data-driven, estetica cinematografica e tecnologia WebGL/WebGPU per trasformare ogni touchpoint in
          un&apos;esperienza memorabile.
        </p>
        <div className="hero__cta-group" role="group" aria-label="Call to action">
          <MagneticButton as="a" href="/contact" variant="primary">
            Prenota una discovery call
          </MagneticButton>
          <MagneticButton as="a" href="/case-studies" variant="ghost">
            Esplora case studies
          </MagneticButton>
        </div>
      </div>
      <Hero3D />
    </section>
  );
}
