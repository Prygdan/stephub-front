'use client';

import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { TCarouselItem } from '@/services/carousels';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Img } from './img';

interface Props {
  carousel: TCarouselItem[]
  className?: string
}

export const PageCarousel: React.FC<Props> = ({ carousel, className }) => {
  return (
    <div className={cn(className, 'overflow-hidden')}>
      <Carousel opts={{
          loop: true
        }}
        plugins={[
          Autoplay({ delay: 3000, stopOnInteraction: true })
        ]} 
        className='overflow-hidden'>
        <CarouselContent>
          {carousel.map((item) => (<CarouselItem key={item.id}>
            <Img src={item.image} alt={item.image} height={200} className='min-h-[200px] object-cover' />
          </CarouselItem>))}
        </CarouselContent>
        <CarouselPrevious className='absolute left-1 top-1/2' />
        <CarouselNext className='absolute right-1 top-1/2' />
      </Carousel>
    </div>
  );
};
