'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type MotionPreferences = {
  reducedMotion: boolean;
  reducedTransparency: boolean;
};

const MotionPreferencesContext = createContext<MotionPreferences>({
  reducedMotion: false,
  reducedTransparency: false
});

export function MotionPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<MotionPreferences>({
    reducedMotion: false,
    reducedTransparency: false
  });

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const transparencyMedia = window.matchMedia('(prefers-reduced-transparency: reduce)');

    const update = () =>
      setPrefs({
        reducedMotion: motionMedia.matches,
        reducedTransparency: transparencyMedia.matches
      });

    update();
    motionMedia.addEventListener('change', update);
    transparencyMedia.addEventListener('change', update);

    return () => {
      motionMedia.removeEventListener('change', update);
      transparencyMedia.removeEventListener('change', update);
    };
  }, []);

  return <MotionPreferencesContext.Provider value={prefs}>{children}</MotionPreferencesContext.Provider>;
}

export function useMotionPreferences() {
  return useContext(MotionPreferencesContext);
}
