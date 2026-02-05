'use client';

import React from 'react';
import Link from 'next/link';
import { TProduct } from '@/services/products';
import { ImageCarousel } from '../image-carousel';
import { Img } from '../img';
import { Container } from "@/components/shared/container";
import { ProductPriceClient } from './product-price-client';
import { ProductSizes } from './product-sizes';
import { TSize } from '@/services/sizes';
import { Button } from '@/components/ui/button';
import { ProductAccordion } from './product-accordion';
import { SizeError } from './size-error';
import { useCartStore } from '@/hooks/use-cart';
import { Alert } from '../alert-dialog';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { FastOrder } from './fast-order';
import { Favorites } from './favorites';
import { cn } from '@/lib/utils';

interface Props {
  product:    TProduct
  className?: string
  admin?:     boolean
}

export const ProductDetails: React.FC<Props> = ({ product, admin=false, className }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const [open, setOpen] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<TSize | null>(null);
  const [sizeError, setSizeError] = React.useState(false);
  const [fastOpen, setFastOpen] = React.useState(false);
  
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  const handleAddToCart = async () => {
    if(selectedSize == null) {
      setSizeError(true);
      return;
    }

    addToCart({
      id:               0,
      product_id:       product.id ?? '',
      slug:             product.slug ?? '',
      name:             product.name,
      image:            product.images![0].image,
      article:          product.article,
      price:            product.price,
      disconted_price:  product.discounted_price,
      size_id:          selectedSize.id,
      size_eu:          selectedSize.value_eu,
      size_cm:          selectedSize.value_cm,
      quantity:         1
    })

    setOpen(true);
    setSelectedSize(null);
  }

  const handleSelectSize = (size: TSize) => {
    setSizeError(false);
    setSelectedSize(size)
  }

  return (
    <div className={cn('relative', className)}>
      <Alert
        open={open}
        setOpen={() => {setOpen(false)}}
        type='success'
        title='Виконано' 
        description='Товар успішно додано у кошик' 
        className='uppercase text-center' 
        cancel={<><ArrowLeft /> Продовжити покупки</>}
        next={<Link href="/cart" className='flex gap-3'><ShoppingCart /> Перейти до кошика</Link>}
      />
      <FastOrder 
        product={product}
        fastOrderOpen={fastOpen}
        setFastOrderOpen={() => setFastOpen(false)}
      />

      {product.id &&
        <Favorites 
          size={18} 
          productId={product.id} 
          className='md:hidden absolute right-3 top-3 z-20 bg-white rounded-full p-1' 
        />
      }

      {product.images && product.images.length > 0 && (<>
          {/* For mobile */}
        {!admin && <div className="relative md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex">
            {product.images.map((i) =>
              <Img
                key={i.id}
                src={i.image}
                alt={i.image}
                width={1200}
                height={1200}
                className="max-w-[95%] min-h-auto shrink-0 object-cover inline-block" 
              />
            )}
          </div>
        </div>}

          {/* For desctop */}
        <Container className='flex gap-4 lg:gap-7'>
            {/* IMAGE CAROUDSEL FOR DESCTOP */}
          {!admin && <div className="hidden md:block relative z-10">
            <ImageCarousel
              images={product.images.map((i) => i.image)} 
              discont={product.discount} 
            />
          </div>}

            {/* PRODUCT DETAILS */}
          <div className='relative grow'>
            <div className='flex items-center gap-1 justify-between'>
              <h1 className='text-[24px] mt-4 md:mt-0 leading-6 font-bold'>{product.name}</h1>
              {product.id && 
                <Favorites 
                  size={22} 
                  productId={product.id} 
                  className='hidden md:block bg-white rounded-full p-1' />}
            </div>

            <ProductPriceClient 
              product={product} 
              textPrice='24'
              textDiscount='20'  
              className='my-2 lg:my-4'
            />
            <ProductSizes 
              product={product} 
              selectedSize={selectedSize} 
              onSizeSelect={handleSelectSize} 
              error={sizeError}
              className='mt-4 md:mt-0'
            />
            
            {sizeError && <SizeError setSizeError={setSizeError}/>}

            {!admin && <div className="mt-5 lg:flex gap-4">
              <Button 
                className={
                  `grow rounded-none font-bold py-6 bg-[#95C0A4] hover:bg-[#86b395] 
                  uppercase cursor-pointer w-full lg:w-min
                  ${!hasSizes && 'opacity-50'}`} 
                onClick={handleAddToCart} 
                disabled={!hasSizes}
                >
                Додати в кошик
              </Button>
              <Button 
                className={
                  `grow rounded-none font-bold py-6 hover:bg-neutral-100 uppercase border border-neutral-200 
                  bg-white text-black cursor-pointer w-full lg:w-min mt-2 lg:mt-0
                  ${!hasSizes && 'opacity-50'}`} 
                onClick={() => setFastOpen(true)} 
                disabled={!hasSizes}>
                Купити в один клік
              </Button>
            </div>}

            {!admin && <ProductAccordion className='mt-5' />}
            
            <div className="mt-5 flex gap-2 font-medium">
              <ul className="text-[14px] w-full">
                {/* Only For Admin */}
                {admin && <>
                  {product.category && <li className="flex gap-1 justify-between">
                    <span className="text-[#777777]">Категорія</span>
                    <span className="block mb-1.25 flex-1 border-b border-dotted border-gray-400"></span>
                    <span className="text-balack font-medium">{product.category.name}</span>
                  </li>}
                  {product.subcategory && <li className="flex gap-1 justify-between">
                    <span className="text-[#777777]">Підкатегорія</span>
                    <span className="block mb-1.25 flex-1 border-b border-dotted border-gray-400"></span>
                    <span className="text-balack font-medium">{product.subcategory.name}</span>
                  </li>}
                </>}

                {product.brand && <li className="flex gap-1 justify-between">
                  <span className="text-[#777777]">Бренд</span>
                  <span className="block mb-1.25 flex-1 border-b border-dotted border-gray-400"></span>
                  <span className="text-balack font-medium">{product.brand.name}</span>
                </li>}
                {product.article && <li className="flex gap-1 justify-between">
                  <span className="text-[#777777]">Артикул</span>
                  <span className="block mb-1.25 flex-1 border-b border-dotted border-gray-400"></span>
                  <span className="text-balack font-medium">{product.article}</span>
                </li>}
                {product.season && <li className="flex gap-1 justify-between">
                  <span className="text-[#777777]">Сезон</span>
                  <span className="block mb-1.25 flex-1 border-b border-dotted border-gray-400"></span>
                  <span className="text-balack font-medium">{product.season.name}</span>
                </li>}
                {product.material && <li className="flex gap-1 justify-between">
                  <span className="text-[#777777]">Матеріал</span>
                  <span className="block mb-1.25 flex-1 border-b border-dotted border-gray-400"></span>
                  <span className="text-balack font-medium">{product.material.name}</span>
                </li>}
              </ul>
            </div>
          </div>
        </Container>

      </>)}
    </div>
  );
};
