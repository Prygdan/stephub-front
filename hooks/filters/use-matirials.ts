import { TMaterial } from '@/services/materials';
import { get } from '@/services/materials';
import { useFetchOptions } from '../use-fetch-options';

export const useMaterials = (enabled: boolean) => {
  const { items: materials, loading, error } = useFetchOptions<TMaterial>({
    fetcher: get,
    enabled
  });
  return { materials, loading, error };
}
