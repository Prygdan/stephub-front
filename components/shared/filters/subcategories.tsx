'use client';

import React from 'react';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';
import { TSubcategory } from '@/services/subcategories';

interface Props {
  filters:                ReturnFiltersProps
  subcategories:          TSubcategory[]
  availableSubcategories?:TSubcategory[]
  loading:                boolean
  className?:             string
}

export const Subcategories: React.FC<Props> = ({ filters, subcategories, availableSubcategories, loading, className }) => {
  const items = subcategories.map((item) => ({ value: String(item.id), text: item.name }));
  const availableItems = availableSubcategories && availableSubcategories.map((item) => ({ value: String(item.id), text: item.name }));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        name="subcategories"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items ?? []}
        loading={loading}
        onClickCheckbox={(value) => {
          filters.setSubcategories(value);
        }}
        selected={filters.subcategories}
        available={availableItems}
      />
    </div>
  );
};
