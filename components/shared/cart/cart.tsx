'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/hooks/use-cart';
import { CheckCircle2, ShoppingBag, Trash, Trash2 } from 'lucide-react';
import { CartItem } from './cart-item';
import { Loading } from '../loading';
import { TCartItem } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '../breadcrumbs';
import { ButtonClient } from '../button-client';

interface Props {
  className?: string;
  clear?: boolean
  onCartUpdate?: (cartItems: TCartItem[]) => void;
}

export const Cart: React.FC<Props> = ({ onCartUpdate, clear, className }) => {
  const { items, updateCart, removeFromCart, clearCart, loadCart } = useCartStore();
  const [ isLoaded, setIsLoaded ] = React.useState(false);

  const totalAmount = items.reduce(
    (acc, item) =>
      acc + (item.disconted_price != null ? item.disconted_price : item.price) * item.quantity,
    0
  );

  React.useEffect(() => {
    loadCart();
    setIsLoaded(true); 
  }, [loadCart]);

  React.useEffect(() => {
    const cartItems = items.map(({ product_id, size_cm, size_eu, size_id, id, name, slug, image, article, price, disconted_price, quantity }) => ({
      id,
      size_cm,
      size_eu,
      size_id,
      product_id,
      name,
      price,
      disconted_price,
      quantity,
      slug,
      image,
      article,
    }));
    onCartUpdate && onCartUpdate(cartItems);
  }, [items]);

  React.useEffect(() => {
    clear && clearCart();
  }, [clear])

  if (!isLoaded) return <Loading />; 

  return (
    <div className={cn(className, 'text-[#1E1E1E]')}>
      <Breadcrumbs
        items={[
          { label: 'Вміст кошика' } 
        ]} 
        className='py-4 border-b border-b-neutral-200'
      />
      
      <h1 className="text-[28px] font-medium my-3">Вміст кошика</h1>

      <div>
        {items.length !== 0 ? (
          <div>
            <div>
              <div>
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size_id}-${index}`}
                    className={`grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_0.5fr_1fr_0.5fr] border-t border-t-neutral-200 py-6 px-2 ${
                      index === items.length - 1 && 'border-b border-b-neutral-200'
                    }`}
                  >
                    <div className="mb-7 md:mb-0 col-span-3 md:col-span-1">
                      <CartItem
                        slug={item.slug}
                        name={item.name}
                        image={item.image ?? ''}
                        article={item.article}
                        size_cm={item.size_cm}
                        size_eu={item.size_eu}
                        classNameImg='max-w-[200px]'
                      />
                    </div>

                      {/* Cart Counter */}
                    <div className="flex gap-5 items-center max-h-[30px] bg-neutral-100 w-min px-3 rounded-lg">
                      <button
                        onClick={() => updateCart(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className='text-[24px] cursor-pointer'
                      >
                        -
                      </button>
                      <span className="block text-[24px]">{item.quantity}</span>
                      <button 
                        onClick={() => updateCart(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 50}
                        className='block text-[24px] cursor-pointer'
                      >
                        +
                      </button>
                    </div>

                      {/* Product Price */}
                    <div className='relative mx-auto'>
                      {item.disconted_price 
                      ? <div className='font-bold md:font-medium'>
                          <div className='flex gap-1 text-[20.5px]'>
                            <span>{item.disconted_price}</span>
                            <span className='block font-bold md:font-medium text-[#1E1E1E]'>грн</span>
                          </div>
                          <div className='text-[#777777] flex gap-1'>
                            <span className='line-through text-[16.5px]'>{item.price}</span>
                            <span>грн</span>
                          </div>
                      </div>
                      : <div className='flex gap-1'>
                        <span className='block font-bold md:font-medium text-[#1E1E1E]'>{item.price}</span>
                        <span className='block font-bold md:font-medium text-[#1E1E1E]'>грн</span>
                      </div>
                      }
                    </div>

                    <div className='ml-auto'>
                      <button onClick={() => removeFromCart(item.id)} title='Видалити з корзини' className='cursor-pointer'>
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className='md:flex gap-5 items-center justify-end mt-5 font-bold'>
                <span className='text-neutral-600 text-[16px]'>Підсумкова вартість </span>
                <span className='text-[19px]'> {totalAmount} грн</span>
              </div>

              <div className='blok md:flex justify-between bg-neutral-100 px-1 py-5 lg:px-5 rounded-lg mt-5'> 
                <div className='flex gap-2'>  
                  <Button className='w-1/2 text-[12px] md:text-[18px] leading-none m-0 rounded-none'>
                    <Link href={'/'}>Продовжити покупки</Link>
                  </Button>
                  
                  <ButtonClient className='w-1/2 text-[12px] md:text-[18px] block rounded-none' text={<div className='flex justify-center gap-2 items-center leading-none' onClick={() => clearCart()}>
                    <Trash />
                    Очистити кошик
                  </div>}/>
                </div>
                <Link href={'/checkout'}>
                  <ButtonClient className='mt-4 w-full text-[18px] md:w-min md:mt-0 rounded-none' text={<div className='flex gap-2 items-center leading-none'>
                  <CheckCircle2 size={26}/>Оформити замовлення</div>}
                  />
                </Link>
              </div>

            </div>
          </div>
        ) : (
          <div className="tracking-widest text-center uppercase">
            <div className="text-center flex justify-center mt-7">
              <ShoppingBag size={150} className="opacity-30" />
            </div>
            <span className="block text-[14px] mt-[35px] mb-[85px]">У кошику немає товарів</span>
              <Button asChild className="w-full py-4">
                <Link href="/products">Продовжити покупки</Link>
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};
