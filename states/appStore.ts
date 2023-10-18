import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useAppStore = create(
  combine({ windowSize: { width: 0, height: 0 } }, (set) => ({
    setWindowSize: (width: number, height: number) => set({ windowSize: { width, height } }),
  }))
);

export default useAppStore;
