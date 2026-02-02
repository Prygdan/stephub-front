'use client';

import React from 'react';
import { ProductReview } from '@/services/product-reviews/product-review';
import { ReviewItem } from './review-item';

type Props = {
  refetch?:     () => void;
  reviews:      ProductReview[]
  className?:   string
}

export const ReviewList: React.FC<Props> = ({ refetch, reviews, className }) => {
  React.useEffect(() => {
    refetch && refetch();
  }, []);

  return (
    <div className={className}>
      {reviews.map((r) => (
        <ReviewItem 
          key={r.id}
          review={r}  
          className='mb-3' />
      ))}
    </div>
  );
}
