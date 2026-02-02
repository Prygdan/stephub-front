import React from 'react';
import { ProductReview } from '@/services/product-reviews/product-review';
import { MessageSquareQuote } from 'lucide-react';

interface Props {
  review:   ProductReview
  className?: string
}

export const ReviewItem: React.FC<Props> = ({ review, className }) => {
  return (
    <div className={className}>
      <div className="border border-neutral-200 p-3 mb-3">
        <div className='flex justify-between'>
          {review.name != null && (
            <span className="font-bold">
              {review.is_name_hidden
                ? review.name.charAt(0) + '*'.repeat(review.name.length - 1)
                : review.name}
            </span>
          )}
          <span className='text-[13px] text-[#777777]'>{new Date(review.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className='flex items-center gap-1'>
          <div className="mt-1 text-yellow-500">{'★'.repeat(review.rating)}</div>
          <span className='text-[14px] text-[#777777] pt-1'>{review.rating}</span>
        </div>

        {review.disadvantages && <div className='text-[14px] mt-2'>
          <span className='font-bold'>Недоліки</span>  
          <p>{review.disadvantages}</p>
        </div>}

        {review.advantages && <div className='text-[14px] mt-2'>
          <span className='font-bold'>Переваги</span>  
          <p>{review.advantages}</p>
        </div>}

        {review.comment && <div className='text-[14px] mt-2'>
          <span className='font-bold'>Коментар</span>  
          <p>{review.comment}</p>
        </div>}
      </div>
      {review.answer && <div key={review.answer.id} className='ml-12 bg-neutral-100 p-3 text-[#1E1E1E]'>
        <div className='flex items-center gap-1 text-[15px] font-bold'>
          <MessageSquareQuote size={20} />
          <span className='block'>Відповідь від адмінстратора</span>
        </div>
        <p className='text-[14px] mt-0.5'>
          {review.answer?.content}
        </p>
        {review.answer.created_at && <div className='flex justify-end'>
          <span className='text-[13px] text-[#777777]'>{new Date(review.answer.created_at).toLocaleDateString()}</span>
        </div>}
      </div>}
    </div>
  );
};
