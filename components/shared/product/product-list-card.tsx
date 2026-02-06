'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TProduct } from '@/services/products';
import { Img } from '../img';
import { ProductPriceClient } from './product-price-client';
import { ProductSizesListCard } from './product-sizes-list-card';
import { Favorites } from './favorites';

interface Props {
  product: TProduct;
  showByBtn?: boolean;
  className?: string;
}

export const ProductListCard: React.FC<Props> = ({
  product,
  showByBtn = true,
  className,
}) => {
  const LIMIT = 3;

  const visibleImages = React.useMemo(() => {
    return product.images?.slice(0, LIMIT) ?? [];
  }, [product.images]);

  const [activeImg, setActiveImg] = React.useState<number | null>(
    visibleImages[0]?.id ? Number(visibleImages[0].id) : null
  );

  const [firstHover, setFirstHover] = React.useState(true);
  const hoverTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const changeActiveImg = (id: number) => {
    if (firstHover) {
      hoverTimeout.current = setTimeout(() => {
        setActiveImg(id);
      }, 500);
      setFirstHover(false);
    } else {
      setActiveImg(id);
    }
  };

  const resetHover = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    setActiveImg(visibleImages[0]?.id ? Number(visibleImages[0].id) : null);
    setFirstHover(true);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative group', className)}>
      {product.id && (
        <div className="absolute right-2 top-2 z-30">
          <Favorites
            size={18}
            productId={product.id}
            className="bg-white rounded-full p-1 shadow-sm"
          />
        </div>
      )}

      <Link href={`/product/${product.slug}`}>
        <div className="relative" onMouseLeave={resetHover}>
          {visibleImages.length > 0 && (
            <div className="relative bg-neutral-100 pb-2 overflow-hidden">
              {/* Discount badge */}
              {product.discounted_price && (
                <div className="absolute z-30 left-2 top-2 flex text-white bg-[#EB001C] px-1">
                  <span className="block text-[14px]">- {product.discount}%</span>
                </div>
              )}

              {/* Images */}
              {visibleImages.map((img, index) => (
                <Img
                  key={img.id}
                  src={img.image}
                  alt={`${product.name} ${product.id}`}
                  width={290}
                  height={290}
                  className={cn(
                    index === 0 ? 'relative z-10' : 'absolute left-0 top-0 z-10',
                    Number(img.id) === activeImg && 'z-20'
                  )}
                />
              ))}
              
              {/* Hover zones */}
              <div className="absolute inset-0 z-20 flex">
                {visibleImages.map((img) => (
                  <div
                    key={img.id}
                    className="w-full h-full"
                    onMouseEnter={() => changeActiveImg(Number(img.id))}
                  />
                ))}
              </div>

              {/* Navigation indicators */}
              <div
                className={cn(
                  'absolute px-4 flex gap-2 left-0 bottom-1 w-full h-0.5 z-20 transition duration-150',
                  visibleImages.length > 1 ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
                )}
              >
                {visibleImages.map((img) => (
                  <div
                    key={img.id}
                    className={cn(
                      'h-full flex-1',
                      activeImg === Number(img.id) ? 'bg-[#00A3CB]' : 'bg-[#cbcbcb]'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="text-[14px] text-[#1E1E1E] block mt-2 truncate font-medium">
          {product.name}
        </span>

        <ProductSizesListCard product={product} className="mt-2" />

        <ProductPriceClient product={product} className="mt-2" />
      </Link>
    </div>
  );
};