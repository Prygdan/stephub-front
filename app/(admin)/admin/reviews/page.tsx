'use client';

import React from 'react';
import * as crudReviewsAPI from '@/services/product-reviews/product-reviews-crud';
import { Title } from '@/components/shared/title';
import { usePaginatedCrud } from "@/hooks/use-paginated-crud";
import { ReviewItemCrud } from '@/components/shared/review/review-item-crud';

export default function Page() {
  const defaultDataReview: crudReviewsAPI.ProductReviewCrud = {
    id: '', product_id: '', rating: 0, comment: '', is_name_hidden: false, name: ''
  }
  const { 
    items: itemsReview, 
    fetch: fetchReview
  } = usePaginatedCrud<crudReviewsAPI.ProductReviewCrud>(crudReviewsAPI, defaultDataReview);

  return <div className='w-full'>
    <Title text='Список коментарів до товарів' size='xl' className='uppercase' />

    <div className='mt-3 w-full'> 
      {itemsReview.length > 0 
      ? <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-3'>
        {itemsReview.map((i) => 
          <ReviewItemCrud 
            key={i.id}
            review={i} 
            fetchReview={fetchReview}
            showProduct={true}
            className='w-full'/>
        )}
      </div>
      : <span>Записи відсутні</span>
      }
    </div>
  </div>
}