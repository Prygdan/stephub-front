'use client';

import React from 'react';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';
import { TSize } from '@/services/sizes';
import { CheckboxFiltersGroup } from './checkbox-filters-group';

interface Props {
  filters: ReturnFiltersProps
  sizes: TSize[]
  availableSizes?: TSize[]
  loading: boolean
  className?: string
}

export const Sizes: React.FC<Props> = ({ filters, sizes, availableSizes, loading, className }) => {
  const items = sizes.map((item) => (
    {value: String(item.id), text: `${item.value_eu} ${item.value_cm != null ? `(${item.value_cm} см)` : ''}`}
  ));
  const availableItems = availableSizes && availableSizes.map((item) => (
    {value: String(item.id), text: `${item.value_eu} ${item.value_cm != null ? `(${item.value_cm} см)` : ''}`}
  ));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        name="sizes"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items ?? []}
        loading={loading}
        onClickCheckbox={(value) => {
          filters.setSizes(value);
        }}
        selected={filters.sizes}
        available={availableItems}
      />
    </div>
  );
};
