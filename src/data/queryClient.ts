import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

const THIRTY_MIN = 1000 * 60 * 30;
const ONE_DAY = 1000 * 60 * 60 * 24;

// Cache-first config: data is considered fresh for 30 minutes (no refetch),
// and the cache survives restarts via AsyncStorage persistence below.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: THIRTY_MIN,
      gcTime: ONE_DAY * 7,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'shade.query-cache.v1',
  throttleTime: 1000,
});

export const persistOptions = {
  persister: asyncStoragePersister,
  maxAge: ONE_DAY * 7,
};
