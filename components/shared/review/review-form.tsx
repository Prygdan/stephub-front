'use client';

import React from 'react';
import { get, store } from '@/services/product-reviews/product-review';
import { DialogForm } from '../dialog-form';
import { InputCheckbox, InputText, TextArea } from '../inputs';
import { AxiosError } from 'axios';
import { Loading } from '../loading';
import { ArrowLeft, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { InputError } from '../input-error';
import { Alert } from '../alert-dialog';
import { useAuth } from '@/hooks/use-auth';
import { TProduct } from '@/services/products';

interface Props {
  product:          TProduct
  refetchReviews?:  () => Promise<void>
  className?:       string
}

export const ReviewForm: React.FC<Props> = ({ product, refetchReviews, className }) => {
  const [ open, setOpen ] = React.useState<boolean>(false);
  const [ showAlert, setShowAlert ] = React.useState<boolean>(false);
  const [ rating, setRating ] = React.useState<number>(0);
  const [ advantages, setAdvantages ] = React.useState<string>('');
  const [ disadvantages, setDisadvantages ] = React.useState<string>('');
  const [ comment, setComment ] = React.useState<string>('');
  const [ name, setName ] =React.useState<string>('');
  const [ hiddenName, setHiddenName ] = React.useState<boolean>(false);
  const [ errors, setErrors ] = React.useState<Record<string, string[]>>({});
  const [ hoveredRating, setHoveredRating ] = React.useState<number>(0);
  const [ loading, setLoading ] = React.useState(false);

  const { user } = useAuth({ middleware: 'guest' });

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});
      const response = await store(product.slug ?? '', {
        advantages: advantages,
        disadvantages: disadvantages,
        rating: rating,
        comment: comment,
        name: name,
        is_name_hidden: hiddenName,
      })

      if(response.status === 200) {
        setOpen(false);
        setShowAlert(true);
        clearReviewForm();
        refetchReviews && refetchReviews();
        response && await fetch('/api/revalidate-reviews', { method: 'POST' });
      }
    } catch(error) {
      handleError(error, 'Error in send form!');
    } finally {
      setLoading(false);      
    }
  }

  const handleError = (error: unknown, defaultMessage: string) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const message = error.response?.data?.message || defaultMessage;
        /* setAlert(message) */
      }
    } else {
      console.log(error);
    }
  };

  const clearReviewForm = () => {
    setRating(0);
    setAdvantages('');
    setDisadvantages('');
    setComment('');
    setName('');
    setHiddenName(false);
  }

  return (
    <div className={className}>
      <Alert
        open={showAlert}
        setOpen={() => {setShowAlert(false)}}
        type='success'
        title='Відгук успішно додано' 
        description='Він буде доступний після перевірки' 
        className='uppercase text-center' 
        cancel={<><ArrowLeft /> Продовжити перегляд товару</>}
      />

      <DialogForm 
        name='Написати відгук' 
        open={open} 
        openModal={() => setOpen(true)} 
        closeModal={() => {setOpen(false); clearReviewForm()}} 
        sendForm={sendForm}
        triggerClassName='py-2 px-4 md:px-6 md:py-3 bg-white text-black rounded-none border border-neutral-200 hover:bg-neutral-100 font-bold'
        >
          {loading && <Loading className='absolute left-0 top-0 w-full h-full' />}

          {/* Оцінка */}
          <Label className='text-[15px] font-bold'>Ваша оцінка</Label>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition ${
                  (hoveredRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                fill={(hoveredRating || rating) >= star ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          {errors.rating && <div>
            <InputError messages={errors.rating}/>  
          </div>}

          <span className='text-[15px] font-bold'>Написати свій відгук</span>
          <TextArea 
            label='Переваги'
            name='advantages'
            value={advantages}
            onChange={(e) => setAdvantages(e.target.value)}
            errors={errors.advantages}
            labelClassName='mb-2'
            className='mt-2'
          />
          <TextArea 
            label='Недоліки'
            name='disadvantages'
            value={disadvantages}
            onChange={(e) => setDisadvantages(e.target.value)}
            errors={errors.disadvantages}
            labelClassName='mb-2'
            className='mt-2'
          />
          <TextArea 
            label='Коментар'
            name='comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            errors={errors.comment}
            labelClassName='mb-2'
            className='mt-2'
          />
          {!user && <InputText 
            label='Покупець'
            name='buyer'
            value={name}
            onChange={(e) => setName(e.target.value)}
            errors={errors.name}
            labelClassName='mb-2'
            className='mt-2'
            placeholder='Ім`я та прізвище'
          />}
          <InputCheckbox 
            label='Приховати моє ім`я у відгуку'
            name='hiddenName'
            value={hiddenName}
            onChange={(val) => setHiddenName(Boolean(val))}
            errors={errors.hiddenName}
            labelClassName='mb-2'
            className='mt-2'
          />
      </DialogForm>
    </div>
  );
};
