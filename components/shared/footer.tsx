import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from './container';
import { TCategory } from '@/services/categories';
import { Copyright } from 'lucide-react';
import { Contacts } from './contacts';
import Image from 'next/image';

interface Props {
  categories: TCategory[]
  className?: string
}

export const Footer: React.FC<Props> = ({ categories, className }) => {
  return (
    <div className={cn(className, 'bg-white w-full shadow-[2px_-3px_7px_rgb(0,0,0,0.1)]')}>
      <Container className="py-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">

        {/* Categories */}
        <div className="order-1 md:order-1">
          <span className="block text-[16px] font-bold mb-2">
            Категорії
          </span>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
            {categories
              .filter(
                (category) =>
                  Array.isArray(category.subcategories) &&
                  category.subcategories.length > 0
              )
              .map((category) => (
                <div key={category.id}>
                  <span className="block text-[#777777] text-[12px] mb-1">
                    {category.name}
                  </span>

                  {category.subcategories!.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/${category.slug}/${subcategory.slug}`}
                      className="block font-medium text-[14px] hover:text-blue-500 transition-all"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>

        {/* Support */}
        <div className="order-2 md:order-3">
          <span className="block text-[16px] font-bold mb-2">
            Підтримка користувачів
          </span>

          <Link
            href="/"
            className="block font-medium text-[14px] hover:text-blue-500 transition-all"
          >
            Доставка, оплата, повернення
          </Link>
        </div>

        {/* About */}
        <div className="order-3 md:order-4">
          <span className="block text-[16px] font-bold mb-2">
            Про компанію
          </span>

          <Link
            href="/"
            className="block font-medium text-[14px] hover:text-blue-500 transition-all"
          >
            Про нас
          </Link>
        </div>

        {/* Contacts - ЗАВЖДИ ВНИЗУ НА МОБІЛЦІ */}
        <div className="order-4 md:order-2">
          <span className="block text-[16px] font-bold mb-2">
            Контакти
          </span>

          <Contacts />
        </div>

      </Container>


      <Container className="border-t border-t-neutral-100 py-5">
        <div className='flex justify-center items-center mb-4'>
          <Link
            href="https://ryla.digital"
            target="_blank"
            rel="noopener noreferrer"
            className='flex items-center gap-1.5 text-[14px]'
          >
            Розроблено
            <Image
              src="/ryladigital-logo-black.png"
              alt="Ryla Digital"
              width={102}
              height={32}
              className="object-contain"
            />
          </Link>
        </div>
        <div className='flex justify-center items-center text-neutral-600 gap-1 '>
          <Copyright size={12} />
          <span className="text-[14px]">2026 STEPHUB v.1.0</span>
        </div>
      </Container>
    </div>
  );
};

