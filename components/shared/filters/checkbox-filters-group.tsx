'use client';

import React from 'react';
import { FilterChecboxProps, FilterCheckbox } from './filter-checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ChevronsUp } from 'lucide-react';

type Item = FilterChecboxProps;

interface Props {
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  loading?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (id: string) => void;
  defaultValue?: string[];
  selected?: Set<string>;
  className?: string;
  name?: string;
  available?: Item[]
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = 'Пошук...',
  className,
  loading,
  onClickCheckbox,
  selected,
  name,
  available
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  if (loading) {
    return (
      <div className={className}>

        {...Array(limit)
          .fill(0)
          .map((_, index) => <Skeleton key={index} className="h-6 mb-4 rounded-[8px]" />)}

        <Skeleton className="w-28 h-6 mb-4 rounded-[8px]" />
      </div>
    );
  }

  const list = showAll
  ? items
      .filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLocaleLowerCase())
      )
      .sort((a, b) => {
        const aAvailable = available?.some((av) => av.value === a.value) ?? false;
        const bAvailable = available?.some((av) => av.value === b.value) ?? false;
        // якщо aAvailable і bAvailable, порядок не змінюємо
        if (aAvailable === bAvailable) return 0;
        return aAvailable ? -1 : 1; // доступні вверх
      })
  : (defaultItems || items)
      .slice(0, limit)
      .sort((a, b) => {
        const aAvailable = available?.some((av) => av.value === a.value) ?? false;
        const bAvailable = available?.some((av) => av.value === b.value) ?? false;
        if (aAvailable === bAvailable) return 0;
        return aAvailable ? -1 : 1;
      });

  return (
    <div className={className}>

      {showAll && (
        <div className="mb-5">
          <Input
            onChange={onChangeSearchInput}
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
        {list.map((item, index) => {
          const isAvailable = available?.some((a) => a.value === item.value) ?? true;

          return (
            <FilterCheckbox
              key={index}
              text={item.text}
              value={item.value}
              endAdornment={item.endAdornment}
              checked={selected?.has(item.value)}
              onCheckedChange={() => onClickCheckbox?.(item.value)}
              name={name}
              disabled={!isAvailable} // ← головне місце
            />
          );
        })}
      </div>

      {items.length > limit && (
        <div className=''>
          <button onClick={() => setShowAll(!showAll)} className="text-primary w-full mt-3 flex justify-end cursor-pointer">
            {showAll 
            ? <div className='flex w-full items-center gap-2 text-[#95C0A4]'>
                <span className='block text-[10px]'>Менше</span>
                <div className='border-b border-[#95C0A4] border-dashed w-full'></div>
                <div className='flex-none'>
                  <ChevronsUp size={24} />
                </div>
              </div> 
            : <div className='flex w-full items-center gap-2 text-[#95C0A4]'>
                <span className='block text-[10px]'>Більше</span>
                <div className='border-b border-[#95C0A4] border-dashed w-full'></div>
                <div className='flex-none'>
                  <ArrowDown size={24} />
                </div>
              </div> }
          </button>
        </div>
      )}
    </div>
  );
};
