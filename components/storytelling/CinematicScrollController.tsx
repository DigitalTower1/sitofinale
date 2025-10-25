'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const PANEL_SELECTOR = '[data-story-panel]';

export function CinematicScrollController() {
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>(PANEL_SELECTOR));
    if (!panels.length) {
      return;
    }

    if (reducedMotion) {
      panels.forEach((panel) => {
        panel.style.removeProperty('opacity');
        panel.style.removeProperty('pointerEvents');
        panel.style.removeProperty('transform');
      });
      return;
    }

    const trackedTriggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      gsap.set(panels, {
        opacity: 0,
        pointerEvents: 'none',
        zIndex: (index) => panels.length - index,
      });
      if (panels[0]) {
        gsap.set(panels[0], { opacity: 1, pointerEvents: 'auto' });
      }

      panels.forEach((panel, index) => {
        const timeline = gsap
          .timeline({
            defaults: { ease: 'power3.inOut' },
            scrollTrigger: {
              trigger: panel,
              start: 'top top',
              end: '+=140%',
              pin: true,
              pinSpacing: false,
              scrub: true,
              anticipatePin: 1,
              snap: {
                snapTo: (value) => Math.round(value),
                duration: { min: 0.6, max: 1.4 },
                ease: 'power4.out',
              },
              onEnter: () => {
                gsap.to(panel, { opacity: 1, pointerEvents: 'auto', duration: 0.8, ease: 'power3.out' });
                if (panels[index - 1]) {
                  gsap.to(panels[index - 1], {
                    opacity: 0,
                    pointerEvents: 'none',
                    duration: 0.6,
                    ease: 'power2.in',
                  });
                }
              },
              onEnterBack: () => {
                gsap.to(panel, { opacity: 1, pointerEvents: 'auto', duration: 0.7, ease: 'power3.out' });
                if (panels[index + 1]) {
                  gsap.to(panels[index + 1], {
                    opacity: 0,
                    pointerEvents: 'none',
                    duration: 0.5,
                    ease: 'power2.in',
                  });
                }
              },
              onLeave: () => {
                gsap.to(panel, { opacity: 0, pointerEvents: 'none', duration: 0.6, ease: 'power2.in' });
              },
              onLeaveBack: () => {
                gsap.to(panel, { opacity: 0, pointerEvents: 'none', duration: 0.6, ease: 'power2.in' });
              },
            },
          })
          .fromTo(
            panel,
            { filter: 'blur(14px)', opacity: index === 0 ? 1 : 0 },
            { filter: 'blur(0px)', opacity: 1, duration: 0.6 },
            0
          )
          .to(panel, { opacity: 0, filter: 'blur(12px)', duration: 0.8, ease: 'power2.in' }, 0.6);

        if (timeline.scrollTrigger) {
          trackedTriggers.push(timeline.scrollTrigger);
        }
      });

      ScrollTrigger.refresh();
    });

    return () => {
      trackedTriggers.forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, [reducedMotion]);

  return null;
}
