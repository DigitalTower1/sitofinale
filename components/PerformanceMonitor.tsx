'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'event' && entry.duration > 120) {
          console.warn('[perf:event]', entry.name, entry.duration);
        }
      });
    });

    try {
      observer.observe({ type: 'event', buffered: true, durationThreshold: 120 });
    } catch (error) {
      console.debug('PerformanceObserver events non supportati', error);
    }

    const handle = requestAnimationFrame(function loop(time) {
      // Hook per estensioni future (draw call logging via rAF).
      requestAnimationFrame(loop);
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(handle);
    };
  }, []);

  return null;
}
