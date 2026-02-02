import React from 'react';
import Image from 'next/image';
import { TProduct } from '@/services/products';
import { cn } from '@/lib/utils';

interface Props {
  product:        TProduct
  textPrice?:     string
  textDiscount?:  string
  alignItems?:    string
  className?:     string
}

export const ProductPriceClient: React.FC<Props> = ({ product, alignItems='items-center', textPrice='18', textDiscount='12', className }) => {
  return (
    <div className={cn('relative flex', className)}>
      {product.discounted_price 
      ? <div className='flex gap-2'>
          <div className={`text-[#EB001C] text-[${textPrice}px] flex gap-1 ${alignItems}`}>
            <span className='block font-bold'>{product.discounted_price}</span>
            <Image src='/hryvnia-red.svg' width={9} height={14} alt='грн' className='block' />
          </div>
          <div className={`text-[#777777] text-[${textDiscount}px] flex gap-1 ${alignItems}`}>
            <span className='line-through font-bold'>{product.price}</span>
            <Image src='/hryvnia-silver.svg' width={9} height={14} alt='грн' className='block' />
          </div>
      </div>
      : <div>
        <div className={`text-black text-[${textPrice}px] flex gap-1 ${alignItems}`}>
          <span className='block font-bold'>{product.price}</span>
          <Image src='/hryvnia-silver.svg' width={9} height={14} alt='грн' className='block' />
        </div>
      </div>
      }
    </div>
  );
};
