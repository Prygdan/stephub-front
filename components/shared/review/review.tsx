import React from 'react';
import { Description } from '../description';
import { ReviewForm } from './review-form';
import { RaitingTitle } from './raiting-title';
import { ProductsPagination } from '../products-pagination';
import { TProduct } from '@/services/products';
import { PaginatedResponse } from '@/lib/types';
import { ProductReview } from '@/services/product-reviews/product-review';
import { ReviewList } from './review-list';
import { ReviewListAdmin } from './review-list-admin';

interface Props {
  product:          TProduct
  averageRating:    number | null
  admin?:           boolean
  productReviews?:  PaginatedResponse<ProductReview> | null
  className?:       string
  refetch?:          () => void
  refetchReviews?:  () => Promise<void>
}

export const Review: React.FC<Props> = ({ 
  product, productReviews, refetchReviews, averageRating, admin=false, refetch
}) => {
  return (
    <div className='block md:grid md:grid-cols-2 md:gap-2 lg:gap-11 mt-7 text-[#1E1E1E]'>
      <div className='w-full'>
        <div className='border-b border-neutral-200'>
          <span className='text-[17px] font-medium py-1'>Опис</span>
        </div>
        <Description className='mt-3' description={product.description} />
      </div>
      <div className='w-full'>
        <div className='flex w-full justify-between items-center'>
          <span className='text-[18px] lg:text-[24px] font-medium py-1'>
            Відгуки ({productReviews?.total})
          </span>
          {product.id && <ReviewForm product={product} refetchReviews={refetchReviews} />}
        </div>
        {productReviews && productReviews.total > 0 && averageRating && productReviews != null && product.id &&
          <RaitingTitle
            product={product} 
            reviews={productReviews} 
            raiting={averageRating} 
            className='my-4' />
        }

        {productReviews && (
          admin 
            ? <ReviewListAdmin reviews={productReviews.data} refetch={refetch} />
            : <ReviewList reviews={productReviews.data} />
        )}

        {productReviews && productReviews.last_page > 1 && 
          <ProductsPagination 
            refetchProducts={refetchReviews} 
            lastPage={productReviews.last_page} 
            className='my-8' />
        }
      </div>
    </div>
  );
};
