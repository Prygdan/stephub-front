'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DesctopMenu } from './desctop-menu';
import { MobileMenu } from './mobile-menu';
import { TCategory } from '@/services/categories';
import { SearchInputDialog } from '../search/search-input-dialog';

interface Props {
  categories: TCategory[]
  className?: string
}

export const Header: React.FC<Props> = ({ categories, className }) => {
  return (
    <div className={cn(className, 'relative z-50 bg-white text-black')}>
      <SearchInputDialog />

      <div className='block md:hidden'>
        <MobileMenu categories={categories} />
      </div>
      <div className='hidden md:block'>
        <DesctopMenu categories={categories} />
      </div>
    </div>
  );
};
