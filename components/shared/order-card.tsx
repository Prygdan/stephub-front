import React from 'react';
import { OrderStatus, OrderStatusLabel, TOrderResponse } from '@/services/orders';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Img } from './img';
import { ProductPrice } from './product-price/admin';
import { CircleX, Edit } from 'lucide-react';
import { DateFormat } from './date-format';

interface Props {
  order: TOrderResponse
  updateOrder: (order: TOrderResponse) => void
  destroy: (id: string) => void
}

export const OrderCard: React.FC<Props> = ({ order, destroy, updateOrder }) => {
  return (
    <Card className='relative w-full'>
      <CardContent>
        <div className='absolute right-1 top-1 cursor-pointer'>
          <div className='flex gap-2'>
            <div title='Редагувати'>
              <Edit onClick={() => updateOrder(order)} />
            </div>
            <div title='Видалити замовлення'>
              <CircleX onClick={() => destroy(order.id)}/>
            </div>
          </div>
        </div>
        <span className='mt-1 block uppercase text-[11px] font-bold tracking-wider'>Дані покупця</span>
        <div>
          <span className='text-neutral-500 text-xs'>#{order.id} {OrderStatusLabel[Number(order.status) as OrderStatus]}</span>
        </div>

        <div>
          <span className='text-neutral-500 text-xs'>Ім`я:</span>
          <span className='pl-1'>{order.guest?.name}</span>
        </div>

        <div>
          <span className='text-neutral-500 text-xs'>Прізвище:</span>
          <span className='pl-1'>{order.guest?.surname}</span>
        </div>

        {order.guest?.middle_name && 
        <div>
          <span className='text-neutral-500 text-xs'>По батькові:</span>
          <span className='pl-1'>{order.guest?.middle_name}</span>
        </div>}

        <div>
          <span className="text-neutral-500 text-xs">Тел:</span>
          <a href={`tel:${order.guest?.phone}`} className="pl-1 text-blue-600 hover:underline">
            {order.guest?.phone}
          </a>
        </div>

        <span className='block uppercase text-[11px] font-bold tracking-wider mt-3 pt-2 border-t border-t-neutral-300'>Доставка</span>
        {order.guest?.area && 
        <div>
          <span className='text-neutral-500 text-xs'>Область:</span>
          <span className='pl-1'>{order.guest?.area}</span>
        </div>}
        {order.guest?.city && 
        <div>
          <span className='text-neutral-500 text-xs'>Місто:</span>
          <span className='pl-1'>{order.guest?.city}</span>
        </div>}
        {order.guest?.branch && 
        <div>
          <span className='text-neutral-500 text-xs'>Відділення:</span>
          <span className='pl-1'>{order.guest?.branch}</span>
        </div>}
        {order.guest?.postomat && 
        <div>
          <span className='text-neutral-500 text-xs'>Поштомат:</span>
          <span className='pl-1'>{order.guest?.postomat}</span>
        </div>}

        <span className='mt-1 block uppercase text-[11px] font-bold tracking-wider'>Оплата</span>
        <div>
          <span className='text-neutral-500 text-xs'>{order.payment_method === 'overpayment' ? 'Під час отримання' : 'На рахунок продавця'}</span>
        </div>

        {order.comment && <>
          <hr />
          <span className='text-neutral-500 text-xs'>
            {order.comment}
          </span>
        </>
        }

        <span className='block uppercase text-[11px] font-bold tracking-wider mt-3 pt-2 border-t border-t-neutral-300'>Кошик</span>
        <div className='mt-1'>
          {order?.items.map((item, index) => (
            <div key={item.id} className={`flex gap-2 mt-2 pt-2 ${index > 0 && 'border-t border-neutral-300'}`}>
              <div className='w-1/5'>
                <Img src={item.product.images![0].image} alt={item.product.name} />
              </div>
              <div className='w-full text-left'>
                <span className='block'>{item.product.name}</span>
                <span className='block text-xs text-neutral-400'>{item.product.article}</span>
                
                <div className='flex justify-between'>
                  <div className='flex items-center gap-1'>
                    <span className='text-[12px]'>К-сть:</span>
                    <span className='block'>{item.quantity}шт.</span>
                  </div>
                  <div>
                    <div className='flex items-center gap-1'>
                      <span className='text-[12px]'>Ціна:</span>
                      <ProductPrice product={item.product} />
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-1'>
                  <div className='text-xs flex flex-col items-center border border-green-800 px-1'>
                    {item.size && <span className='block'>{item.size.value_eu} EU 
                        {item.size_cm && <span>({item.size_cm} см)</span>}
                      </span>}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        <span className='block text-right uppercase text-[11px] font-bold tracking-wider mt-3 pt-2 border-t border-t-neutral-300'>Сума</span>
        <div className='text-right'>
          {order.total_price} грн.
          {order.created_at && <DateFormat date={order.created_at} />}
        </div>

      </CardContent>
    </Card>
  );
};
