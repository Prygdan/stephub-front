import React from 'react';
import { TBrand } from '@/services/brands';
import { TCarousel } from '@/services/carousels';
import { PageCarousel } from './page-carousel';
import { Img } from './img';

interface Props {
  carousel?:  TCarousel
  brands?:    TBrand[]
  className?: string
}

export const HomePage: React.FC<Props> = ({ carousel, className }) => {
  return (
    <div className={className}>
      {carousel && carousel.items.length <= 1
        ? <>
          {carousel && carousel.items.map((item) => (<div key={item.id}>
            <Img src={item.image} alt={item.image} height={200} className='min-h-[200px] object-cover' />
          </div>))}
        </> 
        : <>
          {carousel && <PageCarousel carousel={carousel.items} />}
        </>
      }
    </div>
  );
};
