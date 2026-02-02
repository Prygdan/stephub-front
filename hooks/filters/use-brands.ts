import { TBrand } from '@/services/brands';
import { get } from '@/services/brands';
import { useFetchOptions } from '../use-fetch-options';

export const useBrands = (enabled: boolean) => {
  const { items: brands, loading, error } = useFetchOptions<TBrand>({
    fetcher: get,
    enabled
  });
  return { brands, loading, error };
}
