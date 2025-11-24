import { create } from 'zustand';

interface TabBarState {
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const useTabBarStore = create<TabBarState>((set) => ({
  isExpanded: false,
  setExpanded: (expanded) => set({ isExpanded: expanded }),
}));
