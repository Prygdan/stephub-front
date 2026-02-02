import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  phone: string;
  className?: string;
}

export const PhoneLink: React.FC<Props> = ({ phone, className }) => {
  const formatPhoneNumber = (phone: string) => {
    // Якщо номер починається з `380`, замінюємо на `0`
    const cleanNumber = phone.startsWith('380') ? phone.replace(/^380/, '0') : phone;

    return cleanNumber.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2-$3-$4');
  };

  const formattedNumber = formatPhoneNumber(phone);

  return (
    <Link href={`tel:+${phone}`} className={cn(className)}>
      {formattedNumber}
    </Link>
  );
};
