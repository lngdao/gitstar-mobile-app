import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CounterState {
  value: number;
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  reset: () => void;
}

/**
 * Zustand store with Immer for immutability and DevTools support
 */
export const useCounterStore = create<CounterState>()(
  devtools(
    immer((set) => ({
      value: 0,
      increment: () =>
        set((state) => {
          state.value += 1;
        }),
      decrement: () =>
        set((state) => {
          state.value -= 1;
        }),
      incrementByAmount: (amount: number) =>
        set((state) => {
          state.value += amount;
        }),
      reset: () =>
        set((state) => {
          state.value = 0;
        }),
    })),
    { name: 'counter-store' },
  ),
);
