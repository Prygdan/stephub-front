'use client';

import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import Link from 'next/link';
import { Img } from './img';
import { TBrand } from '@/services/brands';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

interface Props {
  brands:     TBrand[]
  className?: string
}

export const BrandsList: React.FC<Props> = ({ brands, className }) => {
  return (
    <div className={className}>
      <Carousel opts={{
            loop: true
          }}
          plugins={[
            Autoplay({ delay: 3000, stopOnInteraction: true })
          ]} 
          className="w-full"
        >
        <CarouselContent className="ml-1 mr-1">
          {brands.filter((b) => b.image != null && b.in_popular).map((item, index) => (
            <CarouselItem 
              key={index} 
              className="px-2 md:px-8 basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/7">
              <Link href={`/brand/${item.slug}`}>
                {item.image 
                  ? <Img src={item.image} alt={item.name} className='rounded-lg max-w-[60px] md:max-w-[70px]'/> : ''}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute left-0 top-1/2 shadow-md' />
        <CarouselNext className='absolute right-0 top-1/2 shadow-md' />
      </Carousel>
    </div>
  );
};
