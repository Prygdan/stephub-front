'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getRatingStats, ProductReview, RatingStat, RatingStatResponse } from '@/services/product-reviews/product-review';
import { RatingStars } from './raiting-stars';
import { PaginatedResponse } from '@/lib/types';
import { RatingBreakdown } from './rating-breakdown';
import { Loading } from '../loading';
import { TProduct } from '@/services/products';

interface Props {
  product: TProduct
  reviews: PaginatedResponse<ProductReview> | null
  raiting: number
  className?: string
}

export const RaitingTitle: React.FC<Props> = ({ reviews, product, raiting, className }) => {
  const [ raitingStats, setRaitingStats ] = React.useState<RatingStatResponse>();
  const [ loading, setLoading ] =React.useState(false);
  
  const fetchRatingStats = async () => {
    try {
      setLoading(true);
      const data = await getRatingStats(product.slug ?? '');
      setRaitingStats(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchRatingStats();
  }, []);

  return (
    <div className={cn(className, 'flex gap-5')}>
      <div>
        <div>
          <div className='flex w-max ml-auto items-center gap-1 bg-neutral-100 p-2'>
            <span className='block text-[28px] font-bold'>{raiting}</span>
            <span className='block text-[#777777]'>з 5</span>
          </div>
        </div>
        <RatingStars rating={raiting} className='mt-2' />
        <span className='text-[#777777] text-[14px] mt-2 block'>Відгуки: {reviews?.total}</span>
      </div>

      <div className='w-full'>
        {loading && <Loading />}
        {raitingStats && <RatingBreakdown stats={raitingStats?.stats} />}
      </div>
    </div>
  );
};
