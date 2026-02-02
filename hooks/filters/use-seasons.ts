import { TSeason } from '@/services/seasons';
import { get } from '@/services/seasons';
import { useFetchOptions } from '../use-fetch-options';

export const useSeasons = (enabled: boolean) => {
  const { items: seasons, loading, error } = useFetchOptions<TSeason>({
    fetcher: get,
    enabled
  });
  return { seasons, loading, error };
}
