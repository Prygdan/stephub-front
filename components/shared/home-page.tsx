import React from 'react';
import { TBrand } from '@/services/brands';
import { TCarousel } from '@/services/carousels';
import { PageCarousel } from './page-carousel';

interface Props {
  carousel?:  TCarousel
  brands?:    TBrand[]
  className?: string
}

export const HomePage: React.FC<Props> = ({ carousel, className }) => {
  return (
    <div className={className}>
      {carousel && <PageCarousel carousel={carousel.items} />}
    </div>
  );
};
