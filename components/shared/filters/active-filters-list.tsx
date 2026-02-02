'use client';

import React from 'react';
import { ActiveFilters } from './active-filters';

interface FilterItem {
  id: number | string;
  name: string;
}

interface ActiveFiltersListProps<T extends FilterItem> {
  activeIds: (number | string)[];
  allItems: T[];
  onClear: (id: T['id']) => void;
}

export function ActiveFiltersList<T extends FilterItem>({
  activeIds,
  allItems,
  onClear,
}: ActiveFiltersListProps<T>) {
  return (
    <>
      {activeIds.map((id) => {
        const item = allItems.find((el) => el.id == id);
        if (!item) return null;

        return (
          <ActiveFilters
            key={item.id}
            content={item.name}
            collback={() => onClear(item.id)}
          />
        );
      })}
    </>
  );
}
