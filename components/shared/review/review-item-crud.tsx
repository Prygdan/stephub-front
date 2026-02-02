import React from 'react';
import Link from 'next/link';
import { MessageSquareQuote, PenLine, Star, Trash2, X } from 'lucide-react';
import { ProductReviewCrud } from '@/services/product-reviews/product-reviews-crud';
import { Button } from '@/components/ui/button';
import { DialogForm } from '../dialog-form';
import { InputSelect, InputText, TextArea } from '../inputs';
import * as crudReviewsAPI from '@/services/product-reviews/product-reviews-crud';
import * as crudReviewsAnswerAPI from '@/services/product-reviews/product-reviews-answer-crud';
import { usePaginatedCrud } from '@/hooks/use-paginated-crud';
import { Loading } from '../loading';
import { Img } from '../img';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Props {
  review:       ProductReviewCrud
  fetchReview?: () => void
  showProduct?: boolean
  className?:   string
}

export const ReviewItemCrud: React.FC<Props> = ({ 
  review, 
  fetchReview,
  showProduct=false,
  className 
}) => {
  const defaultDataReview: crudReviewsAPI.ProductReviewCrud = {
    id: '', product_id: '', rating: 0, comment: '', is_name_hidden: false, name: ''
  }
  const { 
    item: itemReview, 
    setItem: setItemReview, 
    create: createReview, 
    update: updateReview, 
    loading: loadingReview, 
    open: openReview, 
    openModal: openModalReview, 
    closeModal: closeModalReview, 
    destroy: destroyReview, 
    errors: errorsReview
  } = usePaginatedCrud<crudReviewsAPI.ProductReviewCrud>(crudReviewsAPI, defaultDataReview);

  const defaultDataReviewAnswer: crudReviewsAnswerAPI.ProductReviewAnswerCrud = {
    id: '', content: ''
  }
  const { 
    item: itemReviewAnswer, 
    setItem: setItemReviewAnswer, 
    create: createReviewAnswer, 
    update: updateReviewAnswer, 
    loading: loadingReviewAnswer, 
    open: openReviewAnswer, 
    openModal: openModalReviewAnswer, 
    closeModal: closeModalReviewAnswer, 
    destroy: destroyReviewAnswer, 
    errors: errorsReviewAnswer,
  } = usePaginatedCrud<crudReviewsAnswerAPI.ProductReviewAnswerCrud>(crudReviewsAnswerAPI, defaultDataReviewAnswer);

  const sendFormReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (itemReview.id) {
      const response = await updateReview(itemReview, itemReview.id);
      response && await fetch('/api/revalidate-reviews', { method: 'POST' });
    } else {
      const response = await createReview(itemReview);
      response && await fetch('/api/revalidate-reviews', { method: 'POST' });
    }

    fetchReview && fetchReview();
  }

  const [reviewIdForAnswer, setReviewIdForAnswer] = React.useState<string>();

  const sendFormReviewAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemReviewAnswerFull: crudReviewsAnswerAPI.ProductReviewAnswerCrud = 
      { ...itemReviewAnswer, product_review_id: reviewIdForAnswer};

    if (itemReviewAnswer.id) {
      const response = await updateReviewAnswer(itemReviewAnswerFull, itemReviewAnswer.id);
      response && await fetch('/api/revalidate-reviews', { method: 'POST' });
    } else {
      const response = await createReviewAnswer(itemReviewAnswerFull);
      response && await fetch('/api/revalidate-reviews', { method: 'POST' });
    }

    fetchReview && fetchReview();
  }

  if (loadingReview || loadingReviewAnswer) return <Loading />;

  const handleOpenReviewAnswerCreate = (reviewId: string) => {
    openModalReviewAnswer();
    setReviewIdForAnswer(reviewId);
  }

  const handleOpenReviewAnswerUpdate = (reviewId: string, answer?: crudReviewsAnswerAPI.ProductReviewAnswerCrud) => {
    answer && openModalReviewAnswer(answer);
    setReviewIdForAnswer(reviewId);
  }

  const handleDestroyReviewAnswer = async (answer?: crudReviewsAnswerAPI.ProductReviewAnswerCrud) => {
    answer?.id && destroyReviewAnswer(answer.id);
    fetchReview && fetchReview();
    await fetch('/api/revalidate-reviews', { method: 'POST' });
  }

  return (
    <div className={className}>
        {/* Dialof Forn For Review Answer */}
    <DialogForm isName={false} open={openReviewAnswer} openModal={openModalReview} closeModal={() => closeModalReviewAnswer()} item={itemReviewAnswer} sendForm={sendFormReviewAnswer}>
      <TextArea
        label='Відповідь' 
        name='content'
        value={itemReviewAnswer.content} 
        onChange={(e) => setItemReviewAnswer({ ...itemReviewAnswer, content: e.target.value })}
        errors={errorsReviewAnswer.content}
        placeholder='Відповідь'
      />
    </DialogForm>

      {/* Dialog Form For Review */}
    <DialogForm isName={false} open={openReview} openModal={openModalReview} closeModal={() => closeModalReview()} item={itemReview} sendForm={sendFormReview}>
      {itemReview.user_id === null && 
      <InputText
        label='Прізвище ім`я користувача'
        name='name'
        value={itemReview.name ? itemReview.name : ''} 
        onChange={(e) => setItemReview({ ...itemReview, name: e.target.value })}
        errors={errorsReview.name}
        placeholder='Ім`я користувача'
      />
      }
      <InputSelect
        label='Оцінка'
        name='rating'
        value={String(itemReview.rating)}
        onChange={(e) => setItemReview({ ...itemReview, rating: Number(e)})}
        errors={errorsReview.rating}
        selectItems={[
          {id: '1', name: <><Star/></>},
          {id: '2', name: <><Star/><Star/></>},
          {id: '3', name: <><Star/><Star/><Star/></>},
          {id: '4', name: <><Star/><Star/><Star/><Star/></>},
          {id: '5', name: <><Star/><Star/><Star/><Star/><Star/></>},
        ]}
      />
      <TextArea
        label='Коментар' 
        name='comment'
        value={itemReview.comment} 
        onChange={(e) => setItemReview({ ...itemReview, comment: e.target.value })}
        errors={errorsReview.comment}
        placeholder='Коментар'
      />
      <TextArea
        label='Переваги' 
        name='advantages'
        value={itemReview.advantages} 
        onChange={(e) => setItemReview({ ...itemReview, advantages: e.target.value })}
        errors={errorsReview.advantages}
        placeholder='Переваги'
      />
      <TextArea
        label='Недоліки' 
        name='disadvantages'
        value={itemReview.disadvantages} 
        onChange={(e) => setItemReview({ ...itemReview, disadvantages: e.target.value })}
        errors={errorsReview.disadvantages}
        placeholder='Недоліки'
      />
    </DialogForm>
      <div className="border border-neutral-200 p-3 mb-3">
        {showProduct && <Link 
          href={`/admin/products/${review.product?.slug}`}
          className='flex gap-3 items-center hover:opacity-75 transition-all'>
          {review.product?.images && review.product?.images?.length > 0 &&                   
            <Carousel className='relative'>
              <CarouselContent className='w-27'>
                {review.product.images?.map((i) => (<CarouselItem key={i.id}>
                  <Img src={i.image} alt={review.product?.name ?? ''} width={108}/>
                </CarouselItem>))}
              </CarouselContent>
              <CarouselPrevious className='absolute left-0' />
              <CarouselNext className='absolute right-0' />
            </Carousel>}
            <div>
              <h3 className='text-[16px]'>{review.product?.name}</h3>
            </div>
        </Link>}
        <div className='flex justify-between mt-2'>
          {review.name != null && (
            <span className="font-bold">
              {review.is_name_hidden
                ? review.name.charAt(0) + '*'.repeat(review.name.length - 1)
                : review.name}
            </span>
          )}
          <span className='text-[13px] text-[#777777]'>
            {review.created_at && new Date(review.created_at).toLocaleDateString()}
          </span>
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
        
        <div>
          {review && <>
            <div className='mt-3 flex w-full justify-end gap-1 mb-1'>
              <Button 
                size='sm' 
                title='Редагувати'  
                onClick={() => openModalReview(review)}>
                <PenLine />
              </Button>
              <Button 
                size='sm'
                title='Видалити' 
                onClick={() => destroyReview(review.id)}>
                <Trash2 />
              </Button>
              {!review.answer && <>
                <Button 
                  size='sm'
                  title='Відповідь' 
                  onClick={() => handleOpenReviewAnswerCreate(review.id)}>
                    Відповісти
                  </Button>
              </>}
            </div>
          </>}
        </div>
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
        <div className='flex justify-end mt-3 gap-1'>
          {review.answer && 
            <Button 
              size={'sm'} 
              title='Редагувати відповідь' 
              onClick={() => handleOpenReviewAnswerUpdate(review.id, review.answer)}>
              <PenLine />
            </Button>
          }
          {review.answer && 
            <Button 
              size={'sm'} 
              title='Видалити відповідь' 
              onClick={() => handleDestroyReviewAnswer(review.answer)}>
                <X />
              </Button>}
        </div>
      </div>}
    </div>
  );
};
