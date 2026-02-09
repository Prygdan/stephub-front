import React from 'react';
import Link from 'next/link';
import { Img } from '../img';
import { cn } from '@/lib/utils';
import { show, TProduct } from '@/services/products';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  image:          string;
  slug:           string;
  name:           string;
  article:        string;
  size_eu?:       string;        
  size_cm?:       string;
  quantity?:      number;
  className?:     string;
  classNameImg?:  string;
}

export const CartItem: React.FC<Props> = (
  {image, quantity, slug, size_eu, size_cm, name, article, className, classNameImg='max-w-[100px] max-h-[146px]'}
) => {
  const [ product, setProduct ] = React.useState<TProduct>();
  const [ loading, setLoading ] = React.useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await show(slug);
      setProduct(data.data);
    } catch (error) {
      console.log('Error for get product!');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetch();
  }, [slug]);

  return (
    <div className={cn(className, 'flex gap-2 relative')}>
      {loading && <Skeleton className='absolute w-full h-full left-0 top-0 rounded-none'/>}

      <div className={classNameImg}>
        <Img src={image} alt={name} />
      </div>

      <div>
        {product && <Link href={`/product/${product?.slug}`}>
          <span className='block text-[14px] mb-1 font-bold'>{name}</span>
        </Link>}
        <div className='flex gap-1'>
          {size_eu && 
            <span className='block text-[13px] text-neutral-600 mb-1'>{size_eu} EUR</span>}
          {size_cm && 
            <span className='block text-[13px] text-neutral-600 mb-1'>({size_cm} см)</span>}
        </div>
        <span className='block text-[13px] text-neutral-600 mb-1'>{article}</span>
        {quantity && 
          <span className='block text-[13px] text-neutral-600 mb-1'>К-сть: {quantity}</span>}
      </div>
    </div>
  );
};
