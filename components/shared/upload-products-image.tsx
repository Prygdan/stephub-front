'use client';

import React from 'react';
import { store } from '@/services/upload-product-image';
import { CropImage } from './crop-image';
import { Button } from '../ui/button';

interface Props {
  productId: string
  className?: string
  setImages: () => void
}

export const UploadProductsImage: React.FC<Props> = ({ productId, setImages, className }) => {
  const [image, setImg] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [clearImage, setClearImage] = React.useState<boolean>(false);

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (image) {
      try {
        await store(productId, image);
        setImg(null);
        setImages();
        setClearImage(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    if (clearImage) {
      setClearImage(false);
    }
  }, [clearImage]);

  return (
    <div className={className}>
      <form onSubmit={sendForm}>
        <CropImage setImg={setImg} errors={errors} clear={clearImage} aspect={1/1} />

        {image != null && <Button className='mt-4'>Відправити</Button>}
      </form>
    </div>
  );
};

