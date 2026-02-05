'use client';

import React from 'react';
import Link from 'next/link';
import { useFavoriteStore } from '@/hooks/use-favorite';
import { ProductListCard } from '@/components/shared/product/product-list-card';
import { ListTemplate } from '@/components/shared/list-template';
import { ShoppingBag } from 'lucide-react';
import { Loading } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string
}

export const FavoritesClient: React.FC<Props> = ({ className }) => {
  const { favorites, fetch } = useFavoriteStore();
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    fetch().finally(() => setLoading(false));
  }, []);

  return (
    <div className={className}>
      <h1 className="text-[23px] md:text-[34px] tracking-widest text-center uppercase font-light">Закладки</h1>

      {loading
        ? <Loading />
        : <>
          {favorites.length > 0 
          ? 
          <div className='mt-10'>
            <ListTemplate>
              {favorites 
                && favorites.map((fav) => (fav.product && <ProductListCard key={fav.id} product={fav.product}/>))}
            </ListTemplate>
          </div>
          : 
          <div className="tracking-widest text-center uppercase">
            <div className="text-center flex justify-center mt-7">
              <ShoppingBag size={150} className="opacity-30" />
            </div>
            <span className="block text-[14px] mt-[35px] mb-[85px]">У закладках ще немає товарів</span>
            <Button asChild className="w-full py-4">
              <Link href="/">Продовжити покупки</Link>
            </Button>
          </div>
          }
        </>
    }
    </div>
  );
};
