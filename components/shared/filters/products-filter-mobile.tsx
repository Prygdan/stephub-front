'use client';

import React from 'react';
import { isAllowed, whoIsType } from '@/lib/utils';
import { useFilters } from '@/hooks/filters/use-filters';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { Price } from './price';
import { Brands } from './brands';
import { useRefetchFilters } from '@/hooks/filters/use-refetch-filters';
import { TCategory } from '@/services/categories';
import { useBrands } from '@/hooks/filters/use-brands';
import { Materials } from './materials';
import { useMaterials } from '@/hooks/filters/use-matirials';
import { useSeasons } from '@/hooks/filters/use-seasons';
import { Seasons } from './seasons';
import { Sizes } from './sizes';
import { useSizes } from '@/hooks/filters/use-sizes';
import { Subcategories } from './subcategories';
import { Categories } from './categories';
import { useSubcategories } from '@/hooks/filters/use-subcategories';
import { useCategories } from '@/hooks/filters/use-categories';
import { TSubcategory } from '@/services/subcategories';
import { FiltersItemDrawer } from './filters-item-drawer';
import { ActiveFilters } from './active-filters';
import { ActiveFiltersList } from './active-filters-list';
import { TBrand } from '@/services/brands';

interface Props {
  type: TCategory | TSubcategory | TBrand;
  className?: string
}

export const ProductsFilterMobile: React.FC<Props> = ({ type, className }) => {
  const { brands, loading: loadingBrands } = useBrands(
    type ? isAllowed({filter: 'brands', subcategory: type}) : false
  );
  const { materials, loading: loadingMaterials } = useMaterials(
    type ? isAllowed({filter: 'materials', subcategory: type}) : false
  );
  const { seasons, loading: loadingSeasons } = useSeasons(
    type ? isAllowed({filter: 'seasons', subcategory: type}) : false
  );
  const { sizes, loading: loadingSizes } = useSizes(
    type ? isAllowed({filter: 'sizes', subcategory: type}) : false
  );
  const { categories, loading: loadingCategories } = useCategories(
    type ? isAllowed({filter: 'categories', subcategory: type}) : false
  );
  const { subcategories, loading: loadingSubcategories } = useSubcategories(
    type ? isAllowed({filter: 'subcategories', subcategory: type}) : false
  );

  const typeName = whoIsType(type);

  const filters = useFilters(); 
  const availableFilters = useRefetchFilters({
    filters,
    typeSlug: type.slug,
    type: typeName
  });
  useQueryFilters(filters); 

  const clearCategories = () => {filters.resetCategories(); availableFilters.refetch()};
  const clearSubcategories = () => {filters.resetSubcategories(); availableFilters.refetch()};
  const clearPrice = () => {filters.resetPrices(); availableFilters.refetch()};
  const clearBrands = () => {filters.resetBrands(); availableFilters.refetch()};
  const clearSeasons = () => {filters.resetSeasons(); availableFilters.refetch()};
  const clearMaterials = () => {filters.resetMaterials(); availableFilters.refetch()};
  const clearSizes = () => {filters.resetSizes(); availableFilters.refetch()};

  const formattedSizes = React.useMemo(() => {
    return availableFilters.availableSizes.map(size => ({
      id: size.id,
      name: `EU: ${size.value_eu} ${size.value_cm ? `(${size.value_cm} см)` : ''}`,
    }));
  }, [availableFilters.availableSizes]);

  React.useEffect(() => {
    availableFilters.refetch();
  }, []);

  React.useEffect(() => {
    availableFilters.refetch();
  }, [
    filters.prices.priceFrom,
    filters.prices.priceTo,
    filters.brands,
    filters.materials,
    filters.seasons,
    filters.sizes,
    filters.categories,
    filters.subcategories
  ]);

  return (
    <div className={className}>
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>

        {/* Filter Categories */}
        {isAllowed({filter: 'categories', subcategory: type}) && <FiltersItemDrawer 
          title='Для кого'
          triger='Для кого'
          setFilters={filters.categories.size > 0} 
          clear={clearCategories}
        >
          <Categories
            filters={filters}
            categories={categories}
            availableCategories={availableFilters.availableCategories}
            loading={availableFilters.loading || loadingCategories}
          />
        </FiltersItemDrawer>}

        {/* Filter Subcategories */}
        {isAllowed({filter: 'subcategories', subcategory: type}) && <FiltersItemDrawer 
          title='Тип'
          triger='Тип'
          setFilters={filters.subcategories.size > 0} 
          clear={clearSubcategories}
        >
          <Subcategories 
            filters={filters}
            subcategories={subcategories.filter(s => s.category_id === type.id)}
            availableSubcategories={availableFilters.availableSubcategories}
            loading={availableFilters.loading || loadingSubcategories}
          />
        </FiltersItemDrawer>}

        {/* Filter Brands */}
        {isAllowed({filter: 'brands', subcategory: type}) && <FiltersItemDrawer 
          title='Бренди'
          triger='Бренди'
          setFilters={filters.brands.size > 0} 
          clear={clearBrands}
        >
          <Brands 
            filters={filters}
            brands={brands}
            availableBrands={availableFilters.availableBrands}
            loading={availableFilters.loading || loadingBrands}
          />
        </FiltersItemDrawer>}

        {/* Sizes */}
        {isAllowed({filter: 'sizes', subcategory: type}) && <FiltersItemDrawer 
          title='Розмір'
          triger='Розмір'
          setFilters={filters.sizes.size > 0} 
          clear={clearSizes}
        >
          <Sizes 
            filters={filters}
            sizes={sizes}
            availableSizes={availableFilters.availableSizes}
            loading={loadingSizes || availableFilters.loading}
          />
        </FiltersItemDrawer>}
  
        {/* Filter Seasons */}
        {isAllowed({filter: 'seasons', subcategory: type}) && <FiltersItemDrawer 
          title='Сезон'
          triger='Сезон'
          setFilters={filters.seasons.size > 0} 
          clear={clearSeasons}
        >
          <Seasons 
            filters={filters}
            seasons={seasons}
            availableSeasons={availableFilters.availableSeasons}
            loading={availableFilters.loading || loadingSeasons}
          />
        </FiltersItemDrawer>}
  
        {/* Filter Matrials */}
        {isAllowed({filter: 'materials', subcategory: type}) && <FiltersItemDrawer 
          title='Матеріал'
          triger='Матеріал'
          setFilters={filters.materials.size > 0} 
          clear={clearMaterials}
        >
          <Materials 
            filters={filters}
            materials={materials}
            availableMaterials={availableFilters.availableMaterials}
            loading={availableFilters.loading || loadingMaterials}
          />
        </FiltersItemDrawer>}
      </div>

      {/* Show slected active filters */}
      <div className='flex flex-wrap gap-1 mb-3 mt-1'>
        {filters.prices.priceFrom != null && 
          <ActiveFilters
            content={`${filters.prices.priceFrom} грн - ${filters.prices.priceTo} грн`} 
            collback={clearPrice} />
        }
        {filters.categories.size != null &&
          <ActiveFiltersList
            activeIds={Array.from(filters.categories)} 
            allItems={availableFilters.availableCategories} 
            onClear={clearCategories}/>
        }
        {filters.subcategories.size != null &&
          <ActiveFiltersList
            activeIds={Array.from(filters.subcategories)} 
            allItems={availableFilters.availableSubcategories} 
            onClear={clearCategories}/>
        }
        {filters.brands.size != null &&
          <ActiveFiltersList
            activeIds={Array.from(filters.brands)} 
            allItems={availableFilters.availableBrands} 
            onClear={clearBrands}/>
        }
        {filters.sizes.size != null &&
          <ActiveFiltersList
            activeIds={Array.from(filters.sizes)} 
            allItems={formattedSizes} 
            onClear={clearSizes}/>
        }
        {filters.seasons.size != null &&
          <ActiveFiltersList
            activeIds={Array.from(filters.seasons)} 
            allItems={availableFilters.availableSeasons} 
            onClear={clearSeasons}/>
        }
        {filters.materials.size != null &&
          <ActiveFiltersList
            activeIds={Array.from(filters.materials)} 
            allItems={availableFilters.availableMaterials} 
            onClear={clearMaterials}/>
        }
      </div>
    </div>
  );
};
