import { TSubcategory } from '@/services/subcategories';
import { get } from '@/services/subcategories';
import { useFetchOptions } from '../use-fetch-options';

export const useSubcategories = (enabled: boolean) => {
  const { items: subcategories, loading, error } = useFetchOptions<TSubcategory>({
    fetcher: get,
    enabled
  });
  return { subcategories, loading, error };
}
