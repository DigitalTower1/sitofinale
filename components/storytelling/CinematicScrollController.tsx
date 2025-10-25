'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

const PANEL_SELECTOR = '[data-story-panel]';

function clearPanelStyles(panel: HTMLElement) {
  panel.style.removeProperty('opacity');
  panel.style.removeProperty('pointer-events');
  panel.style.removeProperty('transform');
  panel.style.removeProperty('scale');
  panel.style.removeProperty('will-change');
}

export function CinematicScrollController() {
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>(PANEL_SELECTOR));
    if (!panels.length) {
      return;
    }

    if (reducedMotion) {
      panels.forEach(clearPanelStyles);
      return;
    }

    const trackedTriggers: ScrollTrigger[] = [];

    const killTrackedTriggers = () => {
      while (trackedTriggers.length) {
        const trigger = trackedTriggers.pop();
        trigger?.kill();
      }
    };

    const activatePanel = (index: number) => {
      panels.forEach((panel, panelIndex) => {
        panel.style.pointerEvents = panelIndex === index ? 'auto' : 'none';
      });
    };

    const deactivatePanel = (index: number) => {
      const panel = panels[index];
      if (panel) {
        panel.style.pointerEvents = 'none';
      }
    };

    const buildTimelines = () => {
      killTrackedTriggers();
      gsap.killTweensOf(panels);

      gsap.set(panels, {
        autoAlpha: 0,
        pointerEvents: 'none',
        scale: 0.98,
        yPercent: 8,
        zIndex: (index) => panels.length - index,
        transformOrigin: '50% 50%',
        willChange: 'opacity, transform',
      });

      if (panels[0]) {
        gsap.set(panels[0], { autoAlpha: 1, pointerEvents: 'auto', scale: 1, yPercent: 0 });
      }

      panels.forEach((panel, index) => {
        const shouldPin = panel.offsetHeight <= window.innerHeight * 0.92;

        const scrollTriggerConfig: ScrollTrigger.Vars = {
          trigger: panel,
          start: shouldPin ? 'top top' : 'top 80%',
          end: shouldPin
            ? () => `+=${Math.max(window.innerHeight * 0.9, panel.offsetHeight * 0.85)}`
            : 'bottom top',
          scrub: shouldPin ? 0.8 : 0.5,
          pin: shouldPin,
          pinSpacing: shouldPin,
          anticipatePin: shouldPin ? 0.8 : 0,
          onEnter: () => activatePanel(index),
          onEnterBack: () => activatePanel(index),
          onLeave: () => deactivatePanel(index),
          onLeaveBack: () => deactivatePanel(index),
        };

        if (shouldPin) {
          scrollTriggerConfig.snap = {
            snapTo: [0, 1],
            duration: { min: 0.45, max: 0.9 },
            ease: 'power3.out',
          };
        }

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: scrollTriggerConfig,
        });

        timeline
          .fromTo(
            panel,
            { autoAlpha: index === 0 ? 1 : 0, yPercent: 12, scale: 0.94 },
            { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.52, ease: 'power3.out' },
            0
          )
          .to(panel, { autoAlpha: 0, yPercent: -10, scale: 0.97, duration: 0.48, ease: 'power2.inOut' }, 0.68);

        if (timeline.scrollTrigger) {
          trackedTriggers.push(timeline.scrollTrigger);
        }
      });
    };

    buildTimelines();
    ScrollTrigger.refresh();

    let rebuildRaf = 0;
    const requestRebuild = () => {
      if (rebuildRaf) {
        cancelAnimationFrame(rebuildRaf);
      }
      rebuildRaf = requestAnimationFrame(() => {
        buildTimelines();
        ScrollTrigger.refresh();
      });
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            requestRebuild();
          })
        : null;
    panels.forEach((panel) => resizeObserver?.observe(panel));

    const handleResize = () => requestRebuild();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      if (rebuildRaf) {
        cancelAnimationFrame(rebuildRaf);
      }
      killTrackedTriggers();
      panels.forEach((panel) => {
        gsap.set(panel, { clearProps: 'opacity,transform,pointer-events,will-change' });
      });
    };
  }, [reducedMotion]);

  return null;
}
