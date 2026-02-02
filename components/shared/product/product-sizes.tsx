import React from 'react';
import { isSize } from '@/lib/utils';
import { TProduct } from '@/services/products';
import { TSize } from '@/services/sizes';

interface Props {
  product:          TProduct;
  selectedSize:     TSize | null;
  onSizeSelect:     (size: TSize) => void;
  error?:           boolean
  className?:       string;
  classNameItems?:  string;
}

export const ProductSizes: React.FC<Props> = ({ 
  product, selectedSize, onSizeSelect, error, className, classNameItems 
}) => {
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  return (
    <div className={className}>
      {hasSizes
      ? 
      <div>
        <span className='pb-0 block text-[13px] font-bold uppercase tracking-widest'>
          Розмір
        </span>
        <div className={`${classNameItems} flex gap-2 mt-2`}>
          {Array.isArray(product.sizes) &&
            product.sizes.map((size) => (
              isSize(size) && (
                <div
                  key={size.id}
                  className={`
                    flex flex-col justify-center cursor-pointer py-2 w-16 lg:w-20 
                    leading-none text-center border border-[#F0F0F0] lg:hover:bg-neutral-200 
                    ${error && 'border-red-400 bg-red-100 text-red-950'} 
                    ${selectedSize?.id === size.id ? 'border-slate-300 bg-[#EFEFEF]' : ''}`}
                  onClick={() => {onSizeSelect(size)}}
                >
                  <span className='block font-medium text-[14px]'>
                    {size.value_eu}
                  </span>
                  {size.value_cm && <span className={`
                    block mt-1 font-bold text-[12px] text-[#95C0A4] ${error && 'text-red-950'}`}
                  >
                    {size.value_cm} см
                  </span>}
                </div>
              )
            ))}
        </div>
      </div>
      :
      <div>
        <span className='text-red-500 text-sm'>Немає в наявності</span>
      </div>
    }
    </div>
  );
};
