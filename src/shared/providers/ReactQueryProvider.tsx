import { ReactNode, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Network from 'expo-network';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';

type ReactQueryProviderProps = {
  children: ReactNode;
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const setOnlineStatus = (state: Network.NetworkState | null) => {
      if (!state) return;
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      onlineManager.setOnline(isOnline);
    };

    Network.getNetworkStateAsync().then(setOnlineStatus);
    const subscription = Network.addNetworkStateListener(setOnlineStatus);

    return () => {
      subscription.remove();
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
