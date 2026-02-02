'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, HeartCrack } from 'lucide-react';
import { useFavoriteStore } from '@/hooks/use-favorite';

interface Props {
  productId: string
  size?: number
  className?: string
}

export const Favorites: React.FC<Props> = ({ productId, size=23, className }) => {
  const { favorites, toggle } = useFavoriteStore();
  const isFavorite = favorites.some(fav => fav.product_id === productId);

  return (
    <button 
      onClick={() => toggle(productId)} 
      title='Добавити в обрані'
      className={cn(className, 'text-neutral-600 cursor-pointer')}
    >
      {isFavorite
        ? <HeartCrack size={size} className='text-red-700' />
        : <Heart size={size} />
      }
    </button>
  );
};
