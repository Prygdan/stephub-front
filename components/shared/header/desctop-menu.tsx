'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '../logo';
import { TCategory } from '@/services/categories';
import { Container } from '../container';
import { Mail, PhoneCall } from 'lucide-react';
import { PhoneLink } from '../phone-link';
import { HoursWork } from '../hours-work';
import { EmailLink } from '../email-link';
import { MenuIcons } from '../menu-icons';

interface Props {
  categories: TCategory[]
  className?: string
}

export const DesctopMenu: React.FC<Props> = ({ categories, className }) => {
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);

  const handleMouseEnterCategory = (categoryId: string) => {
    setHoveredCategory(categoryId);
  };

  const handleMouseLeaveCategory = () => {
    setHoveredCategory(null);
  };

  return (
    <div className={cn(className, 'fixed top-0 left-0 w-full duration-300 transition-all')}>
      <div className='relative bg-white'>
        <Container className='flex justify-between tracking-wide uppercase text-[#6d6d6d] font-medium text-[10px]'>
          <div className='flex gap-5 py-2'>
            <Link href='/about' className='block hover:text-blue-500'>
              Про нас
            </Link>
            <Link href='/delivery-and-payment' className='block hover:text-blue-500'>
              Доставка, оплата, поверення
            </Link>
          </div>

          <div className='flex items-center text-[13px] text-black font-normal'>
            <div className="relative flex items-center group">
              <PhoneCall size={14} />
              <PhoneLink phone="380999999999" className="ml-2 phone" />
              <PhoneLink phone="380999999999" className="ml-2 phone" />

              <HoursWork className='z-20 absolute bottom-[-120px] left-0 p-3 bg-white hidden group-hover:block shadow-md' />
            </div>
            <div className='flex items-center ml-4'>
              <Mail size={14} />
              <EmailLink email='mega@gmail.com' className='normal-case ml-2' />
            </div>
          </div>
        </Container>
      </div>
      <div className={`relative w-full bg-black text-white`} onMouseLeave={handleMouseLeaveCategory}>
        <Container className='flex justify-between relative'>
          <Link href={'/'} className='flex items-center'>
            <Logo className='max-w-[75px]' />
          </Link>

          {/* Categories list */}
          <ul className='flex items-center'>
          {categories.map((item) => (
            item.subcategories && Object.keys(item.subcategories).length > 0 ?
              <li 
                key={item.id} 
                onMouseEnter={() => handleMouseEnterCategory(item.id)} 
                className={`group cursor-pointer text-[13px] px-5 py-6 ${hoveredCategory === item.id ? 'bg-white text-black' : ''}`}
              >
                <Link href={`/${item.slug}`} className={`pb-[7px] tracking-wider relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100`}>
                  {item.name}
                </Link>
              </li>
              :
              <li 
                key={item.id} 
                className={`cursor-pointer text-[13px] px-5`}
                onMouseLeave={handleMouseLeaveCategory}>
                <Link href={`/${item.slug}`} className={`pb-[7px] text-green-500 tracking-wider relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100`}>
                  {item.name}
                </Link>
              </li>
          ))}
          </ul> 
          <MenuIcons className='flex gap-4' user={false} width={22} phone={false} />
        </Container>

        {/* Subcategories - how watch in hover */}
        <div className="absolute left-0 bottom-0 w-full z-50">
        {categories.map((item) => (
          item.subcategories && Object.keys(item.subcategories).length > 0 && (
            <div 
              key={item.id} 
              className={`absolute w-full left-0 t-0 py-[20px] shadow-xl bg-white duration-150 ease-in-out ${hoveredCategory === item.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <Container className='max-w-[900px]'>
                <div className="grid grid-cols-[repeat(4,1fr)]">
                  {item.subcategories && item.subcategories.map(subcategory => (
                    <div key={subcategory.id}>
                      <Link 
                        key={subcategory.id}
                        href={`/${item.slug}/${subcategory.slug}`} 
                        className="block text-[14px] font-normal my-1 py-1"
                        >
                        <span 
                          className="inline-block text-gray-600 cursor-pointer relative pb-[1px] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gray-600 after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100"
                          >
                          {subcategory.name}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </Container>
            </div>
          )))} 
        </div>   
      </div>
    </div>
  );
};
