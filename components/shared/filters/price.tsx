'use client'

import React from 'react';
import { Input } from '@/components/ui/input';
import { RangeSlider } from '../range-slider';
import { ReturnFiltersProps } from '@/hooks/filters/use-filters';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  filters: ReturnFiltersProps
  availableMinPrice?: string
  availableMaxPrice?: string
  loading: boolean
  className?: string
}

export const Price: React.FC<Props> = ({ filters, loading, availableMinPrice, availableMaxPrice, className }) => {
  const updatePrices = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0]);
    filters.setPrices('priceTo', prices[1]);
  };

  const min = Number(availableMinPrice ?? 0);
  const max = Number(availableMaxPrice ?? 0);


  return (
    <div className={className}>
      <div className="relative flex gap-3 mb-5">
        <Input
          type="number"
          placeholder={availableMinPrice}
          min={availableMinPrice}
          max={availableMaxPrice}
          value={String(filters.prices.priceFrom ?? '')}
          onChange={(e) => {
            filters.setPrices('priceFrom', Number(e.target.value));
          }}
        />
        <Input
          type="number"
          placeholder={availableMaxPrice}
          min={availableMinPrice}
          max={availableMaxPrice}
          value={String(filters.prices.priceTo ?? '')}
          onChange={(e) => {
            filters.setPrices('priceTo', Number(e.target.value));
          }}
        />
        {loading && <Skeleton className="absolute w-full h-full left-0 top-0 mb-4 rounded-[8px]" />}
      </div>

      <div className='relative'>
        <RangeSlider
          min={min}
          max={max}
          step={10}
          value={[
            filters.prices.priceFrom ?? min,
            filters.prices.priceTo ?? max
          ]}
          onValueCommit={updatePrices}
        />

        {loading && <Skeleton className="absolute w-full h-7 left-0 top-[-13px] mb-4 rounded-[8px]" />}
      </div>
    </div>
  );
};
