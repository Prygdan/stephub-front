'use client';

import React from 'react';
import { get as getAvailableFiltersData, TType } from '@/services/available-data-for-filters';
import { ReturnFiltersProps } from './use-filters';
import { TBrand } from '@/services/brands';
import { TSubcategory } from '@/services/subcategories';
import { TCategory } from '@/services/categories';
import { TSeason } from '@/services/seasons';
import { TMaterial } from '@/services/materials';
import { TSize } from '@/services/sizes';

type TRefetchFiltersProps = {
  filters: ReturnFiltersProps,
  typeSlug: string
  type: TType
}

export const useRefetchFilters = ({filters, typeSlug, type}: TRefetchFiltersProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [availableMinPrice, setAvailableMinPrice] = React.useState<string>();
  const [availableMaxPrice, setAvailableMaxPrice] = React.useState<string>();
  const [availableBrands, setAvailableBrands] = React.useState<TBrand[]>([]);
  const [availableCategories, setAvailableCategories] = React.useState<TCategory[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = React.useState<TSubcategory[]>([]);
  const [availableSeasons, setAvailableSeasons] = React.useState<TSeason[]>([]);
  const [availableMaterials, setAvailableMaterials] = React.useState<TMaterial[]>([]);
  const [availableSizes, setAvailableSizes] = React.useState<TSize[]>([]);

  const refetch = async () => {
    const params = new URLSearchParams();

    if (filters.prices.priceFrom !== undefined) {
      params.append('priceFrom', filters.prices.priceFrom.toString());
    }
    if (filters.prices.priceTo !== undefined) {
      params.append('priceTo', filters.prices.priceTo.toString());
    }
    if (filters.brands.size > 0) {
      params.append('brands', Array.from(filters.brands).join(','));
    }
    if (filters.seasons.size > 0) {
      params.append('seasons', Array.from(filters.seasons).join(','));
    }
    if (filters.materials.size > 0) {
      params.append('materials', Array.from(filters.materials).join(','));
    }
    if (filters.categories.size > 0) {
      params.append('categories', Array.from(filters.categories).join(','));
    }
    if (filters.subcategories.size > 0) {
      params.append('subcategories', Array.from(filters.subcategories).join(','));
    }
    if (filters.sizes.size > 0) {
      params.append('sizes', Array.from(filters.sizes).join(','));
    }

    try {
      setLoading(true);
      const data = await getAvailableFiltersData({
        type,
        typeSlug, 
        params: params.toString()
      });

      if (data.status === 200) {
        setAvailableMinPrice(data.data.price_range.min);
        setAvailableMaxPrice(data.data.price_range.max);
        setAvailableBrands(data.data.available_brands ?? []);
        setAvailableMaterials(data.data.available_materials ?? []);
        setAvailableSeasons(data.data.available_seasons ?? []);
        setAvailableCategories(data.data.available_categories ?? []);
        setAvailableSubcategories(data.data.available_subcategories ?? []);
        setAvailableSizes(data.data.available_sizes ?? []);
      }
    } catch (error) {
      setLoading(false);
      console.log('Помилка фільтрів:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    availableMinPrice,
    availableMaxPrice,
    availableBrands,
    availableCategories,
    availableSubcategories,
    availableSeasons,
    availableMaterials,
    availableSizes,
    
    refetch
  }
};
