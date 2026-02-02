'use client'

import React from 'react';
import { Img } from './img';
import { TProduct } from '@/services/products';
import { get, destroy, TProductImage } from '@/services/upload-product-image';
import { Trash2 } from 'lucide-react';
import { Title } from './title';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UploadProductsImage } from './upload-products-image';

interface Props {
  product: TProduct
  className?: string
}

export const ProductImageList: React.FC<Props> = ({ product, className }) => {
  const [images, setImages] = React.useState<TProductImage[]>(product.images || []);

  const fetchImages = async () => {
    const data = await get(product.id ?? '');
    setImages(data);
  }

  const handleDelete = async (imageId: string) => {
    if (confirm('Ви впевнені, що хочете видалити це зображення?')) {
      await destroy(product.id as unknown as string, imageId as unknown as string);
      await fetchImages(); // Оновлюємо список після видалення
    }
  }
  
  React.useEffect(() => {
    setImages(product.images || []);
  }, [product]);

  return (
    <div className={className}>
      <Title text='Галарея фото товару:' />

      {product.id && <div className='max-w-250 py-3'>
        <UploadProductsImage productId={product.id} setImages={fetchImages} />
      </div>}

      <div className={'mt-5 grid gap-2 xs:grid-cols-1 md:grid-cols-3 '}>
        {images.length == 0 && <Title size='xs' text={`${product.name} - ще не має зображень!`} className='my-3'/>}

        {images.map((img) => (<Card key={img.id}>
          <CardHeader>
            <div className='flex justify-end' title='Видалити зображення'>
              <Trash2 onClick={() => handleDelete(img.id)} className='cursor-pointer mr-1' />
            </div>
          </CardHeader>
          <CardContent>
            <Img src={img.image} alt={product.name} className='rounded-lg' />
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
};
