import React from 'react';
import qs from 'qs';
import { Filters } from './use-filters';
import { useRouter } from 'next/navigation';

export const useQueryFilters = (filters: Filters) => {
  const isMounted = React.useRef(false);
  const router = useRouter();

  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        ...filters.prices,
        brands:          Array.from(filters.brands),
        categories:      Array.from(filters.categories),
        subcategories:   Array.from(filters.subcategories),
        seasons:         Array.from(filters.seasons),
        materials:       Array.from(filters.materials),
        sizes:           Array.from(filters.sizes),
      };

      const query = qs.stringify(params, {
        arrayFormat: 'comma',
      });

      router.push(`?${query}`, {
        scroll: false,
      });
    }

    isMounted.current = true;
  }, [filters]);
};
