'use client';

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { onCLS, onFCP, onINP, onLCP } from 'web-vitals';
import type { Metric } from 'web-vitals';

const noop = () => {};

type WebVitalsContextValue = {
  report: (metric: Metric) => void;
};

const WebVitalsContext = createContext<WebVitalsContextValue>({
  report: noop
});

export function useWebVitals() {
  return useContext(WebVitalsContext);
}

export function WebVitalsProvider({ children }: { children: ReactNode }) {
  const reporterRef = useRef<((metric: Metric) => void) | null>(null);

  useEffect(() => {
    const send = (metric: Metric) => {
      if (process.env.NODE_ENV === 'development') {
        console.info('[WebVital]', metric.name, Math.round(metric.value));
      }
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(metric),
        keepalive: true
      }).catch(noop);
    };

    reporterRef.current = send;

    const listeners = [onCLS, onFCP, onINP, onLCP];
    listeners.forEach((listen) => listen((metric) => reporterRef.current?.(metric)));
  }, []);

  const value = useMemo<WebVitalsContextValue>(
    () => ({
      report: (metric: Metric) => {
        const reporter = reporterRef.current;
        if (reporter) {
          reporter(metric);
        }
      }
    }),
    []
  );

  return <WebVitalsContext.Provider value={value}>{children}</WebVitalsContext.Provider>;
}
