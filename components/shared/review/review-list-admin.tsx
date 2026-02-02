"use client";

import React from 'react';
import { ProductReview } from '@/services/product-reviews/product-review';
import { ReviewItemCrud } from './review-item-crud';

interface Props {
  refetch?:     () => void;
  reviews:      ProductReview[]
  className?: string
}

export const ReviewListAdmin: React.FC<Props> = ({ refetch, reviews, className }) => {
  React.useEffect(() => {
    refetch && refetch();
  }, []);

  return (
    <div className={className}>
      {reviews.map((r) => (
        <ReviewItemCrud
          key={r.id}
          review={r}
          fetchReview={refetch}  
          className='mb-3' />
      ))}
    </div>
  );
};
