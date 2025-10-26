import { create } from 'zustand';

type TowerState = {
  phase: number;
  setPhase: (phase: number) => void;
};

export const useTowerStore = create<TowerState>((set) => ({
  phase: 0,
  setPhase: (phase) => set({ phase })
}));

export function dispatchTowerPhase(phase: number) {
  window.dispatchEvent(new CustomEvent('tower-phase', { detail: { phase } }));
}
