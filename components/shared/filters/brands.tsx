'use client';

import React from 'react';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { TBrand } from '@/services/brands';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';

interface Props {
  filters:          ReturnFiltersProps
  brands:           TBrand[]
  availableBrands?: TBrand[]
  loading:          boolean
  className?:       string
}

export const Brands: React.FC<Props> = ({ filters, brands, availableBrands, loading, className }) => {
  const items = brands.map((item) => ({ value: String(item.id), text: item.name }));
  const availableItems = availableBrands && availableBrands.map((item) => ({ value: String(item.id), text: item.name }));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        name="brands"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items ?? []}
        loading={loading}
        onClickCheckbox={(value) => {
          filters.setBrands(value);
        }}
        selected={filters.brands}
        available={availableItems}
      />
    </div>
  );
};
