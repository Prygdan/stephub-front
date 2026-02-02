'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CreditCard, PackageOpen } from 'lucide-react';
import { InputError } from '../input-error';
import { TGuestDelivery } from '@/services/order';

interface Props {
  getData:    (data: TGuestDelivery) => void
  errors:     Record<string, string[]>
  className?: string
}

export type TPatmentMethod = 'card' | 'overpayment';

export const PaymentMethod: React.FC<Props> = ({ getData, errors, className }) => {
  const [selectedPay, setSelectedPay] = React.useState<TPatmentMethod>();

  React.useEffect(() => {
    selectedPay && getData({'payment_method': selectedPay})
  }, [selectedPay])

  return (
    <div className={className}>
      <span className='block uppercase text-[14px] font-bold tracking-wider'>Оплата</span>

      <div className='mt-2'>
        <div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='overpayment'
              checked={selectedPay === 'overpayment'}
              onCheckedChange={() => setSelectedPay('overpayment')}
            />
            <div className='flex items-center gap-1'>
              <PackageOpen size={18} className='text-neutral-500' />
              <Label htmlFor='overpayment' className='block'>Під час отримання товару</Label>
            </div>
          </div>
        
          <div className='mt-3 flex items-center gap-2'>
            <Checkbox
              id='card'
              checked={selectedPay === 'card'}
              onCheckedChange={() => setSelectedPay('card')}
            />
            <div className='flex items-center gap-1'>
              <CreditCard size={18} className='text-neutral-500' />
              <Label htmlFor='card' className='block'>На рахунок продавця</Label>
            </div>
          </div>
        </div>
        <InputError messages={errors.payment_method} />
      </div>
    </div>
  );
};
