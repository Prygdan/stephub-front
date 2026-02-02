import React from 'react';
import { cn } from '@/lib/utils';
import { TProduct } from '@/services/products';
import { isSize } from '@/lib/utils';

interface Props {
  product: TProduct;
  className?: string;
}

export const ProductSizes: React.FC<Props> = ({ product, className }) => {
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  return (
    <div className={cn(className, 'flex flex-wrap gap-1')}>
      {hasSizes ? (
        product.sizes.map((size) =>
          isSize(size) ? (
            <div
              key={size.id}
              className='border flex flex-col justify-center text-center border-gray-600 p-1'
            >
              <span className='block text-[12px] leading-none'>
                {size.value_eu}
                <span className='text-[8px]'> EUR</span>
              </span>
              {size.value_cm && (
                <span className='block text-[10px] leading-none'>
                  {size.value_cm} <span className='text-[9px]'> см</span>
                </span>
              )}
            </div>
          ) : null
        )
      ) : (
        <span className='text-red-500 text-sm'>Немає в наявності</span>
      )}
    </div>
  );
};
