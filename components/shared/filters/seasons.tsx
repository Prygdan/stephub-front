'use client';

import React from 'react';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';
import { TSeason } from '@/services/seasons';

interface Props {
  filters:            ReturnFiltersProps
  seasons:            TSeason[]
  availableSeasons?:  TSeason[]
  loading:            boolean
  className?:         string
}

export const Seasons: React.FC<Props> = ({ filters, seasons, availableSeasons, loading, className }) => {
  const items = seasons.map((item) => ({ value: String(item.id), text: item.name }));
  const availableItems = availableSeasons && availableSeasons.map((item) => ({ value: String(item.id), text: item.name }));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        name="seasons"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items ?? []}
        loading={loading}
        onClickCheckbox={(value) => {
          filters.setSeasons(value);
        }}
        selected={filters.seasons}
        available={availableItems}
      />
    </div>
  );
};
