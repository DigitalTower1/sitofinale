'use client';

import { MotionPreferencesProvider } from '../hooks/useMotionPreferences';
import { ThemeProvider } from '../hooks/useTheme';
import { WebVitalsProvider } from '../lib/analytics/WebVitalsProvider';
import { PerformanceMonitor } from './PerformanceMonitor';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WebVitalsProvider>
      <ThemeProvider>
        <MotionPreferencesProvider>
          <PerformanceMonitor />
          {children}
        </MotionPreferencesProvider>
      </ThemeProvider>
    </WebVitalsProvider>
  );
}
