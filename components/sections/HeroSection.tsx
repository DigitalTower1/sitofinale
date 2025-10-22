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
    const heroEl = container.current;
    const cleanups: Array<() => void> = [];

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

      gsap.to('.hero__visual-aura', {
        opacity: 0.75,
        filter: 'blur(60px)',
        duration: 4.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      gsap.to('.hero__visual-reflection', {
        backgroundPosition: '120% 40%',
        duration: 12,
        ease: 'none',
        repeat: -1
      });

      gsap.to('.hero__visual', {
        boxShadow: '0 60px 160px rgba(232, 184, 107, 0.35)',
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, container);

    const visual = heroEl.querySelector<HTMLElement>('.hero__visual');
    const aura = heroEl.querySelector<HTMLElement>('.hero__visual-aura');

    if (visual) {
      gsap.set(visual, { transformPerspective: 900 });
      const rotateX = gsap.quickTo(visual, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const rotateY = gsap.quickTo(visual, 'rotationY', { duration: 0.6, ease: 'power3.out' });

      const handleMove = (event: PointerEvent) => {
        const rect = visual.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        rotateY((relX - 0.5) * 16);
        rotateX(-(relY - 0.5) * 12);

        if (aura) {
          gsap.to(aura, {
            x: (relX - 0.5) * 60,
            y: (relY - 0.5) * 50,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      };

      const resetTilt = () => {
        rotateX(0);
        rotateY(0);
        if (aura) {
          gsap.to(aura, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
        }
      };

      heroEl.addEventListener('pointermove', handleMove);
      heroEl.addEventListener('pointerleave', resetTilt);
      cleanups.push(() => {
        heroEl.removeEventListener('pointermove', handleMove);
        heroEl.removeEventListener('pointerleave', resetTilt);
      });
    }

    return () => {
      cleanups.forEach((dispose) => dispose());
      ctx.revert();
    };
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
