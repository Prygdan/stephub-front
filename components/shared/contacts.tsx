import React from 'react';
import { PhoneLink } from './phone-link';
import { Facebook, Instagram, Send } from 'lucide-react';

interface Props {
  className?: string
}

export const Contacts: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <div>
        <PhoneLink phone="+380965636999" className='cursor-pointer hover:text-blue-500' />
      </div>
      <div>
        <PhoneLink phone="+380965636999" className='cursor-pointer hover:text-blue-500' />
      </div>

      <div className='text-[#777777] text-[11.2px] leading-normal font-medium mt-1'>
        Пн - Пт 10:00 - 19:00 Сб 10:00 - 18:00 Нд 12:00 - 18:00
      </div>
      <hr className='my-2' />

      <div className='flex gap-2'>
        <div className='bg-neutral-500 hover:bg-[#96C0A4] rounded-full p-2 cursor-pointer'>
          <Send className='text-white cursor-pointer' size={16} />
        </div>
        <div className='bg-neutral-500 hover:bg-[#96C0A4] rounded-full p-2 cursor-pointer'>
          <Instagram className='text-white cursor-pointer' size={16} />
        </div>
        <div className='bg-neutral-500 hover:bg-[#96C0A4] rounded-full p-2 cursor-pointer'>
          <Facebook className='text-white cursor-pointer' size={16} />
        </div>
      </div>

      <div>
        <span className='block text-[11.2px] text-[#777777] font-normal mt-3'>Email</span>
        <span className='block text-[14px] text-[#1E1E1E] font-medium'>info@mega-mass.ua</span>
        <span className='block text-[11.2px] text-[#777777] font-normal mt-2'>Адреса</span>
        <span className='block text-[14px] text-[#1E1E1E] font-medium'>Україна, Тернопіль, вул. Руська 2</span>
      </div>
    </div>
  );
};
