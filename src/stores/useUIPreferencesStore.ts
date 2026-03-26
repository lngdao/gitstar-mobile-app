import { getStorage } from '@/libs/storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UIPreferencesState {
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
}

const mmkvStorage = {
  getItem: (name: string) => {
    try {
      const storage = getStorage();
      const value = storage.getString(name);
      return value ?? null;
    } catch (error) {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      const storage = getStorage();
      storage.set(name, value);
    } catch (error) {
      console.error('[UIPreferencesStore] Error setting item:', error);
    }
  },
  removeItem: (name: string) => {
    try {
      const storage = getStorage();
      storage.delete(name);
    } catch (error) {
      console.error('[UIPreferencesStore] Error removing item:', error);
    }
  },
};

export const useUIPreferencesStore = create<UIPreferencesState>()(
  devtools(
    persist(
      immer((set) => ({
        isBalanceHidden: false,

        toggleBalanceVisibility: () =>
          set((state) => {
            state.isBalanceHidden = !state.isBalanceHidden;
          }),
      })),
      {
        name: 'ui-preferences-storage',
        storage: createJSONStorage(() => mmkvStorage),
        partialize: (state) => ({
          isBalanceHidden: state.isBalanceHidden,
        }),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          try {
            return {
              ...currentState,
              ...(persistedState as Partial<UIPreferencesState>),
            };
          } catch (error) {
            console.warn('[UIPreferencesStore] Error merging state:', error);
            return currentState;
          }
        },
      },
    ),
    { name: 'ui-preferences-store' },
  ),
);
