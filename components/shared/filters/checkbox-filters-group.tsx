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
    ? items.filter((item) => item.text.toLowerCase().includes(searchValue.toLocaleLowerCase()))
    : (defaultItems || items).slice(0, limit);

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
          <button onClick={() => setShowAll(!showAll)} className="text-primary mt-3">
            {showAll 
            ? <div className='flex items-center cursor-pointer underline decoration-dashed text-blue-500'>
              <ChevronsUp size={17} />
              <span>Закрити</span>
            </div> 
            : <div className='flex items-center cursor-pointer underline decoration-dashed text-blue-500'>
              <ArrowDown size={17} />
              <span>Показати всі</span>
            </div> }
          </button>
        </div>
      )}
    </div>
  );
};
