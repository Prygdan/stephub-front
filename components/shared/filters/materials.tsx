'use client';

import React from 'react';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';
import { TMaterial } from '@/services/materials';

interface Props {
  filters:            ReturnFiltersProps
  materials:          TMaterial[]
  availableMaterials?:TMaterial[]
  loading:            boolean
  className?:         string
}

export const Materials: React.FC<Props> = ({ filters, materials, availableMaterials, loading, className }) => {
  const items = materials.map((item) => ({ value: String(item.id), text: item.name }));
  const availableItems = availableMaterials && availableMaterials.map((item) => ({ value: String(item.id), text: item.name }));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        name="materials"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={availableItems ?? []}
        loading={loading}
        onClickCheckbox={(value) => {
          filters.setMaterials(value);
        }}
        selected={filters.materials}
        available={availableItems}
      />
    </div>
  );
};
