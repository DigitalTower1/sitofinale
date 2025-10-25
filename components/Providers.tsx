'use client';

import { MotionPreferencesProvider } from '../hooks/useMotionPreferences';
import { ThemeProvider } from '../hooks/useTheme';
import { WebVitalsProvider } from '../lib/analytics/WebVitalsProvider';
import { PerformanceMonitor } from './PerformanceMonitor';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WebVitalsProvider>
      <ThemeProvider>
        <MotionPreferencesProvider>
          <SmoothScrollProvider>
            <PerformanceMonitor />
            {children}
          </SmoothScrollProvider>
        </MotionPreferencesProvider>
      </ThemeProvider>
    </WebVitalsProvider>
  );
}
