import { create } from 'zustand';
import * as Network from 'expo-network';

interface NetworkStore {
  /**
   * Current network state
   */
  state: Network.NetworkState;
  /**
   * Update network state
   */
  setState: (state: Network.NetworkState) => void;
  /**
   * Check if device is offline
   */
  isOffline: () => boolean;
  /**
   * Check if device is online
   */
  isOnline: () => boolean;
}

/**
 * Network state store
 * Updated by Application component via network subscription
 */
export const useNetworkStore = create<NetworkStore>((set, get) => ({
  state: {
    type: Network.NetworkStateType.UNKNOWN,
    isConnected: undefined,
    isInternetReachable: undefined,
  },

  setState: (state) => set({ state }),

  isOffline: () => {
    const { state } = get();
    return (
      state.isConnected === false || state.isInternetReachable === false
    );
  },

  isOnline: () => {
    const { state } = get();
    return (
      state.isConnected === true && state.isInternetReachable === true
    );
  },
}));
