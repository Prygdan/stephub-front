'use client';

import React from 'react';
import { ProductsFilter } from './products-filter';
import { ProductsFilterMobile } from './products-filter-mobile';
import { TBrand } from '@/services/brands';
import { TSubcategory } from '@/services/subcategories';
import { TCategory } from '@/services/categories';

interface Props {
  type: TCategory | TSubcategory | TBrand;
  className?: string
}

export const Filters: React.FC<Props> = ({ type, className }) => {
  return (
    <div className={className}>
      <ProductsFilterMobile
        type={type}  
        className='block md:hidden'
      />
      <ProductsFilter
        type={type} 
        className='hidden md:block w-50 md:w-65' 
      />
    </div>
  );
};



/* 
'use client';

import React from 'react';
import { ProductsFilter } from './products-filter';
import { ProductsFilterMobile } from './products-filter-mobile';
import { TBrand } from '@/services/brands';
import { TSubcategory } from '@/services/subcategories';
import { TCategory } from '@/services/categories';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  type: TCategory | TSubcategory | TBrand;
  className?: string
}

export const Filters: React.FC<Props> = ({ type, className }) => {
  const isMobile = useIsMobile();

  return (
    <div className={className}>
      {isMobile 
        ? <ProductsFilterMobile
          type={type}  
        />
        : <ProductsFilter
          type={type} 
          className='w-50 md:w-65' 
        />
      }
    </div>
  );
};

*/