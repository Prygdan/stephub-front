import { TCategory } from '@/services/categories';
import { get } from '@/services/categories';
import { useFetchOptions } from '../use-fetch-options';

export const useCategories = (enabled: boolean) => {
  const { items: categories, loading, error } = useFetchOptions<TCategory>({
    fetcher: get,
    enabled
  });
  return { categories, loading, error };
}
