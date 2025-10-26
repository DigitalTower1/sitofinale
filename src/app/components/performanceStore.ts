import { create } from 'zustand';

type PerformanceState = {
  fps: number;
  tier: 'high' | 'medium' | 'low';
  setMetrics: (fps: number, tier: 'high' | 'medium' | 'low') => void;
};

export const usePerformanceStore = create<PerformanceState>((set) => ({
  fps: 0,
  tier: 'high',
  setMetrics: (fps, tier) => set({ fps, tier })
}));
