'use client';

import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CartItem } from '../cart/cart-item';
import { InputText } from '../inputs';
import { handleChangePhone } from '@/lib/utils';
import { ProductSizes } from './product-sizes';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { fastStore, TFastOrder } from '@/services/order';
import { fastSend as fastSendTelegram } from '@/services/telegram';
import { SizeError } from './size-error';
import { Loading } from '../loading';
import { ArrowLeft, CircleCheckBig } from 'lucide-react';
import { TProduct } from '@/services/products';
import { TSize } from '@/services/sizes';
import { AxiosError } from 'axios';

interface Props {
  product:          TProduct
  fastOrderOpen:    boolean
  setFastOrderOpen: (open: boolean) => void
  className?:       string
}

export const FastOrder: React.FC<Props> = ({ product, fastOrderOpen, setFastOrderOpen, className }) => {
  const [name, setName] = React.useState<string>('');
  const [surname, setSurname] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<number>(1);
  const [phone, setPhone] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [loading, setLoading] = React.useState(false);
  const [sizeError, setSizeError] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<TSize | null>(null);
  
  const router = useRouter();

  const handleOrderSuccess = () => {
    setLoading(false)

    return router.push('/thank-you');
  };

  const totalAmount = quantity * (product.discounted_price ?? product.price);

  const handleFastOrder = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    const order: TFastOrder = {
      name,
      surname,
      phone,
      products: [
        {
          id: 0,
          product_id: product.id ?? '',
          slug: product.slug ?? '',
          image: product.images![0].image,
          article: product.article,
          name: product.name,
          size_eu: selectedSize.value_eu,
          size_cm: selectedSize.value_cm,
          size_id: selectedSize.id,
          quantity,
          price: product.discounted_price ?? product.price,
        },
      ],
    };

    try {
      setLoading(true);
      const response = await fastStore(order)
      response.status === 200 && handleOrderSuccess();
      setLoading(false);
    } catch(error: unknown) {
      if (error instanceof AxiosError) {
        if(error.response?.status === 422 && error.response.data?.errors) {
          setErrors(error.response.data.errors);
        } else {
          alert('Помилка при створенні замовлення! Будь ласка зверніться по номеру телефону!')
        }
      } 
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (sizeError) {
      const timeout = setTimeout(() => setSizeError(false), 8000);
      return () => clearTimeout(timeout);
    }
  }, [sizeError,]);

  React.useEffect(() => {
    if (!phone) {
      setPhone('+380');
    }
  }, []);

  React.useEffect(() => {
    setSizeError(false);
  }, [selectedSize])
  
  return (
    <div className={className}>
      <Dialog open={fastOrderOpen} onOpenChange={setFastOrderOpen}>
        <DialogContent className="sm:max-w-[425px] p-3 md:p-5 lg:p-8 overflow-hidden rounded-none">

          {loading 
            && <Loading width={100} height={100} className='absolute z-50 w-full h-full bg-white' />
          }

          <div className='relative'>
            <DialogHeader>
              <DialogTitle className='text-left text-[16x] sm:text-[20px] uppercase pb-8'>
                <span className='border-b-2 border-black pb-2 tracking-widest'>Швидке замовлення</span>
              </DialogTitle>
            </DialogHeader>

            {sizeError && <SizeError setSizeError={setSizeError} className='z-40 ' />}

            {product.images && product.images?.length > 0 && <CartItem
              image={product.images![0].image}
              slug={product.slug ?? ''}
              name={product.name}
              article={product.article}
              classNameImg='max-w-[75px] max-h-[97px]'
            />}
            <ProductSizes
              product={product}
              selectedSize={selectedSize} 
              onSizeSelect={setSelectedSize} 
              className='mt-6 mb-4 pt-3 border-t border-neutral-200'
              error={sizeError}
            />

            <div className='flex justify-between items-center border-t border-neutral-200'>
              <div className="flex gap-8 py-2 pl-5 ">
                <button
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="text-[23px]"
                >
                  -
                </button>
                <span className="block text-[24px]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[23px]" 
                >
                  +
                </button>
              </div>
              <div className='text-[22px]'>
                {totalAmount} грн.
              </div>
            </div>

            <form className='pt-4 border-t border-neutral-200'>
              <InputText
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                label={'Прізвище'}
                name={'surname'}
                errors={errors?.surname}
                labelClassName='font-light pb-1 block'
                required
              />
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                label={'Ім\'я'}
                name={'name'}
                errors={errors?.name}
                className='mt-3'
                labelClassName='font-light pb-1 block'
                required
              />
              <InputText
                value={phone}
                onChange={(e) => handleChangePhone(e, setPhone)}
                label={'Телефон'}
                name={'phone'}
                errors={errors?.phone}
                className='mt-3'
                labelClassName='font-light pb-1 block'
                required
              />
            </form>
            
            <DialogFooter>
              <div className='flex gap-3 w-full tracking-widest font-semibold mt-3'>
                <Button 
                  type="submit" 
                  onClick={() => setFastOrderOpen(false)} 
                  className='rounded-none mt-3 uppercase p-5 grow px-4 bg-neutral-300 text-black hover:text-white hover:bg-neutral-400 delay-75'
                >
                  <ArrowLeft />
                  <span>Відміна</span>
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleFastOrder} 
                  className='rounded-none mt-3 uppercase p-5 px-4 grow'
                >
                  <CircleCheckBig />
                  <span>Замовити</span>
                </Button>
              </div>
            </DialogFooter>
          </div>
        
        </DialogContent>
      </Dialog>
    </div>
  );
};