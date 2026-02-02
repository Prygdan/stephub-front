'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  discont?: number;
  className?: string;
}

export const ImageCarousel: React.FC<Props> = ({ images, discont, className }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomPosition, setZoomPosition] = React.useState({ x: "50%", y: "50%" });
  const visibleThumbnails = 8;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className={cn(className, 'flex gap-3')}>
      {/* Список мініатюр */}
      <div className="flex flex-col items-center gap-2 overflow-hidden">
        <div className="flex flex-col gap-2">
          {images.slice(scrollIndex, scrollIndex + visibleThumbnails).map((img, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_STORAGE_APP_URL}/${img}`}
              alt={`Thumbnail ${index}`}
              width={60}
              height={60}
              className={cn(
                'cursor-pointer transition-opacity duration-300',
                index + scrollIndex === currentIndex ? 'opacity-100' : 'opacity-50'
              )}
              onClick={() => setCurrentIndex(index + scrollIndex)}
            />
          ))}
        </div>
      </div>

      {/* Головне фото */}
      <div 
        className="relative w-[390px] h-[390px] lg:w-[490px] lg:h-[490px] overflow-hidden"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <div 
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`,
            cursor: isZoomed ? 'zoom-out' : 'zoom-in'
          }}
        >
          <Image 
            src={`${process.env.NEXT_PUBLIC_STORAGE_APP_URL}/${images[currentIndex]}`} 
            alt="Product image" 
            layout="fill" 
            objectFit="cover" 
            className='shadow-lg shadow-black'
          />
        </div>

        {/* Кнопки навігації */}
        <button 
          onMouseEnter={() => setIsZoomed(false)} 
          onMouseLeave={() => setIsZoomed(true)}
          onClick={prevImage} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-2 py-3"
        >
          <ChevronLeft className="text-white opacity-65 hover:opacity-100 delay-100" size={44} />
        </button>
        <button 
          onMouseEnter={() => setIsZoomed(false)}  
          onMouseLeave={() => setIsZoomed(true)}
          onClick={nextImage} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2 py-3"
        >
          <ChevronRight className="text-white opacity-65 hover:opacity-100 delay-100" size={44} />
        </button>

        {/* Знижка */}
        {discont &&
          <span className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-sm">-{discont}%</span>
        }
      </div>
    </div>
  );
};
