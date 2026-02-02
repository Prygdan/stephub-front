'use client';

import React from 'react';
import { PageCarousel } from './page-carousel';
import { TCarousel } from '@/services/carousels';

interface Props {
  carousel: TCarousel
  className?: string
}

export const Carousel: React.FC<Props> = ({ carousel, className }) => {
  return <div className={className}>
    <PageCarousel carousel={carousel.items} />
  </div>
};
