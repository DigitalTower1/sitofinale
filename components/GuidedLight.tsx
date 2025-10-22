'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

type SectionSnapshot = {
  el: HTMLElement;
  id: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function GuidedLight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const container = containerRef.current;
    const link = linkRef.current;

    if (!container || !link) {
      return;
    }

    const sections: SectionSnapshot[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-guided-section]')
    ).map((el) => ({
      el,
      id: el.dataset.guidedSection ?? 'section',
    }));

    if (sections.length === 0) {
      return;
    }

    let animationFrame = 0;

    const scheduleUpdate = () => {
      if (animationFrame !== 0) {
        return;
      }
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateLight();
      });
    };

    const updateLight = () => {
      if (!container || !link) {
        return;
      }

      const viewportHeight = window.innerHeight || 1;
      const viewportWidth = window.innerWidth || 1;
      const viewportCenter = viewportHeight / 2;
      const viewportCenterDocument = window.scrollY + viewportCenter;

      const metrics = sections.map((section) => {
        const rect = section.el.getBoundingClientRect();
        const centerViewport = rect.top + rect.height / 2;
        const centerDocument = centerViewport + window.scrollY;
        return {
          section,
          rect,
          centerViewport,
          centerDocument,
        };
      });

      if (metrics.length === 0) {
        return;
      }

      let activeIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      metrics.forEach((entry, index) => {
        const distance = Math.abs(entry.centerViewport - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });

      const active = metrics[activeIndex];
      const forward = metrics[Math.min(activeIndex + 1, metrics.length - 1)];
      const backward = metrics[Math.max(activeIndex - 1, 0)];

      container.dataset.activeSection = active.section.id;

      const viewportDiagonal = Math.hypot(viewportWidth, viewportHeight) || viewportHeight;
      const baseRadius = clamp(
        Math.max(active.rect.height, viewportHeight) * 0.65,
        viewportDiagonal * 0.55,
        viewportDiagonal * 0.72
      );
      let targetCenterViewport = active.centerViewport;
      let lightRadius = baseRadius;
      let lightSoftness = baseRadius * 2.2;
      const focusDistance = Math.abs(viewportCenterDocument - active.centerDocument);
      const focusNormalizer = active.rect.height * 0.6 + viewportHeight * 0.25;
      const sectionFocus = clamp(1 - focusDistance / Math.max(focusNormalizer, 1), 0, 1);
      let lightStrength = 0.35 + sectionFocus * 0.45;
      let connectorTop = (targetCenterViewport / viewportHeight) * 100;
      let connectorHeight = 0;
      let connectorOpacity = 0;

      const applyConnector = (fromViewport: number, toViewport: number, progress: number) => {
        const topViewport = Math.min(fromViewport, toViewport);
        const bottomViewport = Math.max(fromViewport, toViewport);
        connectorTop = (topViewport / viewportHeight) * 100;
        connectorHeight = Math.max(60, Math.abs(bottomViewport - topViewport));
        connectorOpacity = clamp(Math.sin(progress * Math.PI), 0, 1);
      };

      if (forward !== active && viewportCenterDocument >= active.centerDocument) {
        const range = forward.centerDocument - active.centerDocument;
        if (range > 1) {
          const progress = clamp(
            (viewportCenterDocument - active.centerDocument) / range,
            0,
            1
          );
          targetCenterViewport =
            active.centerViewport + (forward.centerViewport - active.centerViewport) * progress;
          const forwardRadius = clamp(
            Math.max(forward.rect.height, viewportHeight) * 0.65,
            viewportDiagonal * 0.55,
            viewportDiagonal * 0.72
          );
          lightRadius =
            baseRadius + (forwardRadius - baseRadius) * progress * 0.75;
          lightSoftness = lightRadius * 2.1;
          lightStrength = Math.max(
            lightStrength,
            0.35 + (0.45 + 0.15 * Math.sin(progress * Math.PI))
          );
          applyConnector(active.centerViewport, forward.centerViewport, progress);
        }
      } else if (backward !== active && viewportCenterDocument < active.centerDocument) {
        const range = active.centerDocument - backward.centerDocument;
        if (range > 1) {
          const progress = clamp(
            (active.centerDocument - viewportCenterDocument) / range,
            0,
            1
          );
          targetCenterViewport =
            active.centerViewport - (active.centerViewport - backward.centerViewport) * progress;
          const backwardRadius = clamp(
            Math.max(backward.rect.height, viewportHeight) * 0.65,
            viewportDiagonal * 0.55,
            viewportDiagonal * 0.72
          );
          lightRadius =
            baseRadius + (backwardRadius - baseRadius) * progress * 0.75;
          lightSoftness = lightRadius * 2.1;
          lightStrength = Math.max(
            lightStrength,
            0.35 + (0.45 + 0.15 * Math.sin(progress * Math.PI))
          );
          applyConnector(active.centerViewport, backward.centerViewport, progress);
        }
      }

      const centerRatio = clamp(targetCenterViewport / viewportHeight, 0, 1) * 100;
      const spanViewport = clamp(lightRadius * 1.35, viewportHeight * 0.65, viewportDiagonal * 0.95);
      const startRatio = clamp(
        (targetCenterViewport - spanViewport / 2) / viewportHeight,
        0,
        1
      );
      const endRatio = clamp(
        (targetCenterViewport + spanViewport / 2) / viewportHeight,
        0,
        1
      );
      const glowStart = clamp(startRatio - 0.08, 0, 1) * 100;
      const glowEnd = clamp(endRatio + 0.08, 0, 1) * 100;
      const bandStart = startRatio * 100;
      const bandEnd = endRatio * 100;
      const bandMid = clamp((startRatio + endRatio) / 2, 0, 1) * 100;
      lightStrength = clamp(lightStrength, 0.25, 1);

      container.style.setProperty('--light-center', `${centerRatio}%`);
      container.style.setProperty('--light-radius', `${lightRadius}px`);
      container.style.setProperty('--light-softness', `${lightSoftness}px`);
      container.style.setProperty('--light-strength', lightStrength.toString());
      container.style.setProperty('--light-band-start', `${bandStart}%`);
      container.style.setProperty('--light-band-end', `${bandEnd}%`);
      container.style.setProperty('--light-glow-start', `${glowStart}%`);
      container.style.setProperty('--light-glow-end', `${glowEnd}%`);
      container.style.setProperty('--light-band-mid', `${bandMid}%`);

      link.style.setProperty('--link-top', `${connectorTop}%`);
      link.style.setProperty('--link-height', `${connectorHeight}px`);
      link.style.setProperty('--link-opacity', connectorOpacity.toString());
    };

    updateLight();

    const handleScroll = () => scheduleUpdate();
    const handleResize = () => scheduleUpdate();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const observerSupported = typeof ResizeObserver !== 'undefined';
    const resizeObserver = observerSupported
      ? new ResizeObserver(scheduleUpdate)
      : null;

    if (resizeObserver) {
      sections.forEach((section) => resizeObserver.observe(section.el));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div ref={containerRef} className="guided-light" aria-hidden="true">
      <div className="guided-light__dim" />
      <div className="guided-light__beam" />
      <div ref={linkRef} className="guided-light__link" />
    </div>
  );
}
