'use client';

import React from 'react';
import { cn, isAllowed, whoIsType } from '@/lib/utils';
import { useFilters } from '@/hooks/filters/use-filters';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { ProductFilterContainer } from './product-filter-container';
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
import { TBrand } from '@/services/brands';

interface Props {
  type: TCategory | TSubcategory | TBrand;
  className?: string;
}

export const ProductsFilter: React.FC<Props> = ({ type, className }) => {
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
    <div className={cn('border border-[#EEEEEE] text-[#1E1E1E] px-3', className)}>
      <span className='block text-[16px] font-bold py-3'>Фільтри товарів</span>

      {/* Filter Price */}
      <ProductFilterContainer 
        title='Ціна' 
        setFilters={filters.prices.priceFrom !== undefined || filters.prices.priceTo !== undefined} 
        clearChange={clearPrice}
        startOpen={true}
      >
        <Price 
          filters={filters}
          availableMinPrice={availableFilters.availableMinPrice}
          availableMaxPrice={availableFilters.availableMaxPrice}
          loading={availableFilters.loading}
          />
      </ProductFilterContainer>

      {/* Filter Categories */}
      {isAllowed({filter: 'categories', subcategory: type}) && <ProductFilterContainer 
        title='Для кого'
        setFilters={filters.categories.size > 0} 
        clearChange={clearCategories}
      >
        <Categories
          filters={filters}
          categories={categories}
          availableCategories={availableFilters.availableCategories}
          loading={availableFilters.loading || loadingCategories}
        />
      </ProductFilterContainer>}

      {/* Filter Subcategories */}
      {isAllowed({filter: 'subcategories', subcategory: type}) && <ProductFilterContainer 
        title='Тип'
        setFilters={filters.subcategories.size > 0} 
        clearChange={clearSubcategories}
      >
        <Subcategories 
          filters={filters}
          subcategories={subcategories.filter(s => s.category_id === type.id)}
          availableSubcategories={availableFilters.availableSubcategories}
          loading={availableFilters.loading || loadingSubcategories}
        />
      </ProductFilterContainer>}

      {/* Filter Brands */}
      {isAllowed({filter: 'brands', subcategory: type}) && <ProductFilterContainer 
        title='Бренди'
        setFilters={filters.brands.size > 0} 
        clearChange={clearBrands}
      >
        <Brands 
          filters={filters}
          brands={brands}
          availableBrands={availableFilters.availableBrands}
          loading={availableFilters.loading || loadingBrands}
        />
      </ProductFilterContainer>}

      {/* Sizes */}
      {isAllowed({filter: 'sizes', subcategory: type}) && <ProductFilterContainer 
        title='Розмір'
        setFilters={filters.sizes.size > 0} 
        clearChange={clearSizes}
        startOpen={true}
      >
        <Sizes 
          filters={filters}
          sizes={sizes}
          availableSizes={availableFilters.availableSizes}
          loading={loadingSizes || availableFilters.loading}
        />
      </ProductFilterContainer>}

      {/* Filter Seasons */}
      {isAllowed({filter: 'seasons', subcategory: type}) && <ProductFilterContainer 
        title='Сезон'
        setFilters={filters.seasons.size > 0} 
        clearChange={clearSeasons}
      >
        <Seasons 
          filters={filters}
          seasons={seasons}
          availableSeasons={availableFilters.availableSeasons}
          loading={availableFilters.loading || loadingSeasons}
        />
      </ProductFilterContainer>}

      {/* Filter Matrials */}
      {isAllowed({filter: 'materials', subcategory: type}) && <ProductFilterContainer 
        title='Матеріал'
        setFilters={filters.materials.size > 0} 
        clearChange={clearMaterials}
      >
        <Materials 
          filters={filters}
          materials={materials}
          availableMaterials={availableFilters.availableMaterials}
          loading={availableFilters.loading || loadingMaterials}
        />
      </ProductFilterContainer>}

    </div>
  );
};
