'use client';

import React from 'react';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';
import { TCategory } from '@/services/categories';

interface Props {
  filters:                ReturnFiltersProps
  categories:             TCategory[]
  availableCategories?:   TCategory[]
  loading:                boolean
  className?:             string
}

export const Categories: React.FC<Props> = ({ filters, categories, availableCategories, loading, className }) => {
  const items = categories.map((item) => ({ value: String(item.id), text: item.name }));
  const availableItems = availableCategories && availableCategories.map((item) => ({ value: String(item.id), text: item.name }));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        name="categories"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={availableItems ?? []}
        loading={loading}
        onClickCheckbox={(value) => {
          filters.setCategories(value);
        }}
        selected={filters.categories}
        available={availableItems}
      />
    </div>
  );
};
