import React from 'react';
import { cn, isSize } from '@/lib/utils';
import { TProduct } from '@/services/products';

interface Props {
  product:    TProduct;
  className?: string
}

export const ProductSizesListCard: React.FC<Props> = ({ product, className }) => {
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  
  return (
    <div className={cn(className, 'flex flex-wrap gap-1')}>
      {hasSizes 
        ? (
          product.sizes.map((size) => isSize(size) 
            ? <div key={size.id} className='border border-neutral-300 text-neutral-400 leading-none text-[12px] px-1 py-0.5'>
              <span>{size.value_eu}</span>
            </div>
            : null
          )
        )
        : null
      }
    </div>
  );
};

/* border border-gray-[#B3B3B3] text-[#B3B3B3] */