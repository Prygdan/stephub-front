'use client';

import React from "react";
import { UserForm } from "@/components/shared/checkout/user-form";
import { Loading } from "@/components/shared/loading";
import { UserDelivery } from "@/components/shared/checkout/user-delivery";
import { TGuest, TOrderRequest } from "@/services/order";
import { Button } from "@/components/ui/button";
import { store as orderStore } from '@/services/order';
import { useRouter } from "next/navigation";
import { TCartItem, useCartStore } from "@/hooks/use-cart";
import { Container } from "@/components/shared/container";
import { CartItem } from "@/components/shared/cart/cart-item";
import { AxiosError } from "axios";
import { PaymentMethod } from "@/components/shared/checkout/payment-method";

export default function CheckoutClient() {
  const [sendGuestData, setSendGuestData] = React.useState<TGuest>();
  const [cartData, setCartData] = React.useState<TCartItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const router = useRouter();
  const { items, clearCart, loadCart } = useCartStore();

  const handleOrderSuccess = (order: TOrderRequest) => {
    if(order.payment_method === 'card') {
      router.push('/pay');
    } else {
      router.push('/thank-you');
    }
  };

  const handleSendForm = async () => {
    const order: TOrderRequest = {
      ...sendGuestData,
      products: cartData
    };
    try {
      setLoading(true);
      const response = await orderStore(order);

      if(response.status === 200) {
        //sendTelegram(order);
        handleOrderSuccess(order);
        setSendGuestData({});
        clearCart();
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if(error.response?.status === 422 && error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }else {
          alert('Помилка при створенні замовлення! Будь ласка зверніться по номеру телефону!')
        }
      } 
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    setCartData(items)
  }, [items]);

  React.useEffect(() => {
    loadCart()
  }, []);

  return <Container className='mt-10'>
    <div>
      <span className='uppercase text-[20px] font-medium border-b-4 border-black pb-3 pt-4'>Оформлення замовлення</span>
    </div>

      {/* SHOW PRODUCTS IN CART FOR CHECKOUT */}
    <div>
      <span className='block uppercase text-[14px] mt-[40px] font-bold tracking-wider'>Товари</span>
      {items.map((item) => (<div key={item.id}>
        <CartItem
          slug={item.slug}
          name={item.name}
          image={item.image ?? ''}
          article={item.article}
          size_cm={item.size_cm}
          size_eu={item.size_eu}
          quantity={item.quantity}
          classNameImg='max-w-[100px]'
        />
      </div>))}
    </div>

    <form className="relative">
      {loading && <Loading className="absolute w-full h-full bg-white z-30" />}
      <div className="mt-5">
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 lg:gap-6'>
          <UserForm
            getData={data => setSendGuestData(prev => ({ ...prev, ...data }))} 
            errors={errors} 
          />
          <UserDelivery
            getData={data => setSendGuestData(prev => ({ ...prev, ...data }))} 
            errors={errors} 
          />
          <PaymentMethod
            getData={data => setSendGuestData(prev => ({ ...prev, ...data }))} 
            errors={errors} 
          />
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Button
              onClick={handleSendForm}
              className="w-full rounded-lg font-bold py-6 hover:bg-neutral-100 uppercase 
                        border border-neutral-200 bg-white text-black cursor-pointer mt-5"
              disabled={loading}
            >
              {loading ? 'Завантаження...' : 'Оформити замовлення'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  </Container>
}

