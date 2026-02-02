import React from 'react';
import { cn } from '@/lib/utils';
import { TProduct } from '@/services/products';

interface Props {
  product: TProduct
  className?: string
}

export const ProductPrice: React.FC<Props> = ({ product, className }) => {
  return (
    <div className={cn('relative max-w-[80px]', className)}>
      <span className={`${product.discounted_price && 'line-through'} block whitespace-nowrap`}>{product.price} ₴</span>
      {product.discount != 0 && <span className='absolute top-[-10px] right-[-5px] bg-red-300 rounded-sm px-1 text-xs whitespace-nowrap'>-{product.discount}%</span>}
      {product.discounted_price && <span className='bg-green-300 whitespace-nowrap px-1 rounded-sm'>{product.discounted_price} ₴</span>}
    </div>
  );
};
