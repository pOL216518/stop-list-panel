import { create } from 'zustand';

interface StopPanelState {
  openItemId: string | null;
  openPanel: (id: string) => void;
  closePanel: () => void;
}

export const useStopPanelStore = create<StopPanelState>((set) => ({
  openItemId: null,
  openPanel: (id) => set({ openItemId: id }),
  closePanel: () => set({ openItemId: null }),
}));