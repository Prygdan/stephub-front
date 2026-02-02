'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Heart, Phone, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import { useFavoriteStore } from '@/hooks/use-favorite';
import { useSearchState } from '@/hooks/use-search';

interface Props {
  showData?:  () => void;
  width?:     number;
  search?:    boolean;
  phone?:     boolean;
  user?:      boolean;
  heart?:     boolean;
  cart?:      boolean;
  className?: string;
}

export const MenuIcons: React.FC<Props> = ({ className, search = true, phone = true, user = true, heart = true, cart = true, width = 20, showData }) => {
  const { items, loadCart } = useCartStore();
  const { favorites, fetch } = useFavoriteStore();
  const { setOpen } = useSearchState();
  const totalCartItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalFavoritesItems = favorites.length;

  React.useEffect(() => {
    if (favorites.length === 0) { 
      fetch();
    }
    if(items.length) {
      loadCart();
    }
  }, [favorites.length, fetch]);

  return (
    <div className={cn(className, 'flex items-center relative')}>
      {phone && <Phone size={width} onClick={showData} />}
      {search && <Search size={width} className='cursor-pointer' onClick={() => setOpen(true)} />}
      {user && <User size={width} />}
      
      {heart && 
        <div className='relative'>
          <Link href={'/favorites'}>
            <Heart size={width} />
            {totalFavoritesItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalFavoritesItems}
              </span> 
            )}
          </Link>
        </div>
      }

      {cart && (
        <div className="relative">
          <Link href={'/cart'}>
            <ShoppingCart size={width} />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
};
