'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TCategory } from '@/services/categories';
import { Logo } from '../logo';
import { MenuIcon, X } from 'lucide-react';
import { MenuIcons } from '../menu-icons';
import { Container } from '../container';
import { PhoneLink } from '../phone-link';
import { EmailLink } from '../email-link';
import { HoursWork } from '../hours-work';
import { SocialMedia } from '../social-media';

interface Props {
  categories: TCategory[];
  className?: string;
}

export const MobileMenu: React.FC<Props> = ({ categories, className }) => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [changeCategory, setChangeCategory] = React.useState<string | null>(null);
  const [showPhone, setShowPhone] = React.useState<boolean>(false);
  
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const phoneRef = React.useRef<HTMLDivElement | null>(null);

  const handleOpenMenu = () => {
    setIsOpenMenu(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseMenu = () => {
    setIsOpenMenu(false);
    setChangeCategory(null);
    document.body.style.overflow = 'auto';
  };

  const handleChangeCategory = (categoryId: string) => {
    setChangeCategory(prevCategory => (prevCategory === categoryId ? null : categoryId));
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
      if (phoneRef.current && !phoneRef.current.contains(event.target as Node)) {
        setShowPhone(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className={cn(className, `fixed top-0 left-0 duration-150 transition-all bg-black text-white w-full py-3 flex items-center`)}>
      <Container className="absolute top-0 left-0 z-40 w-full bg-black py-3 flex justify-between">
        <div className="flex items-center">
          {isOpenMenu ? <X size={22} onClick={handleCloseMenu} className='text-gray-400 cursor-pointer' /> : <MenuIcon size={22} onClick={handleOpenMenu} className='text-white cursor-pointer' />}
          <Link href={'/'} onClick={handleCloseMenu}>
            <Logo className="ml-5 max-w-[70px]" />
          </Link>
        </div>
        <div className='relative flex items-center'>
          <MenuIcons className="gap-5" width={22} showData={() => setShowPhone(true)} user={false} />
          
          {showPhone && 
          <div ref={phoneRef} className='absolute z-50 right-0 top-13 py-3 bg-black shadow-md'>
            <Container className='text-md text-center border-b border-neutral-500 pb-3'>
              <PhoneLink phone="38099999999" className="block mb-2" />
              <PhoneLink phone="38099999999" className="block mb-2" />
              <EmailLink email='stephub@gmail.com' className='normal-case mt-2' />
            </Container>
            <HoursWork className='text-center uppercase pt-3' />
          </div>}
        </div>
      </Container>

      <div
        className={`${isOpenMenu ? 'left-0' : 'left-[-500px]'} border-t-2 border-neutral-500 absolute top-[55px] pb-4 bg-black duration-500 ease-in-out min-h-screen w-[350px] overflow-y-auto max-h-screen`}
      >
        <Container>
          <div className="text-white uppercase text-[14px] border-b border-neutral-500 overflow-y-auto">
            {categories.map(category => {
              const hasSubcategories = category.subcategories && Object.keys(category.subcategories).length > 0;
              const isOpen = changeCategory === category.id;
              return (
                <div key={category.id}>
                  <div className='relative' onClick={() => handleChangeCategory(category.id)}>
                    <div
                      className="block cursor-pointer leading-none my-3 py-2 max-w-[90%]"
                    >
                      {category.name}
                    </div>
                    {hasSubcategories && (
                      <div className="pl-28 pr-3 absolute top-0 right-0 h-full flex flex-col justify-center">
                        <span 
                          className={` block w-0 h-0 border-t-[6px] border-b-[6px] border-l-[9px] border-solid border-transparent border-l-white transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                        ></span>
                      </div>
                    )}
                  </div>

                  {isOpen && hasSubcategories && (
                    <div className="pl-4">
                      <Link
                        href={`/${category.slug}`}
                        className="block text-[13px] font-normal my-1 py-1"
                        onClick={handleCloseMenu}
                      >
                        <span className="text-gray-400">Все {category.name}</span>
                      </Link>

                      {category.subcategories?.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/${category.slug}/${subcategory.slug}`}
                          className="block text-[13px] font-normal my-1 py-1"
                          onClick={handleCloseMenu}
                        >
                          <span className="text-gray-400">
                            {subcategory.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className='uppercase py-4 border-t border-neutral-500 text-xs text-neutral-400'>
              <Link href='/about' className='block hover:text-blue-500 mb-4' onClick={handleCloseMenu}>
                Про нас
              </Link>
              <Link href='/delivery-and-payment' className='block hover:text-blue-500' onClick={handleCloseMenu}>
                Доставка, оплата, поверення
              </Link>
            </div>
          </div>

          <div>
            <SocialMedia 
              width={22} 
              instagramHref='https://www.instagram.com/stephub_store'
              className='gap-5 mt-4' />
          </div>
        </Container>
      </div>
    </div>
  );
};
