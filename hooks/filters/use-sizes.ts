import { TSize } from '@/services/sizes';
import { get } from '@/services/sizes';
import { useFetchOptions } from '../use-fetch-options';

export const useSizes = (enabled: boolean) => {
  const { items: sizes, loading, error } = useFetchOptions<TSize>({
    fetcher: get,
    enabled
  });
  return { sizes, loading, error };
}
