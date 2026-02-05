'use client';

import React from 'react';
import { InputFile } from './inputs';
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropImageProps {
  setImg: (img: string) => void;
  aspect?: number
  errors?: any;
  clear?: boolean
}

export const CropImage: React.FC<CropImageProps> = ({ setImg, aspect = 1/1, clear = true, errors }) => {
  const [image, setImage] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 1000,
    height: 1000 // Для пропорції 16:9 (50 * 9/16 = 28.125)
  });

  const [completedCrop, setCompletedCrop] = React.useState<Crop | null>(null);
  const [completedImageUrl, setCompletedImageUrl] = React.useState<string | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const onCropComplete = (crop: Crop) => {
    setCompletedCrop(crop);

    if(crop && imgRef.current) {
      generateCroppedImage(crop);
    }
  };

  const generateCroppedImage = (crop: Crop) => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
  
    if (!image || !canvas || !crop.width || !crop.height) return;
  
    const scaleX = image.naturalWidth / image.clientWidth;
    const scaleY = image.naturalHeight / image.clientHeight;
  
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
  
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
  
      const url = canvas.toDataURL('image/jpeg', 0.9); 
      setCompletedImageUrl(url);
    }
  };

    
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const {naturalWidth: width, naturalHeight: height} = e.currentTarget;
    
    setCrop(
      centerCrop(
        makeAspectCrop({
          unit: '%',
          width: 100,
        },
        aspect, // Змінюємо аспект на 16:9
        width,
        height),
        width,
        height
      )
    );
  };

  const clearImage = () => {
    setImage(null);
    setCompletedImageUrl(null);
    setCompletedCrop(null);
    setCrop({
      unit: '%',
      x: 25,
      y: 25,
      width: 50,
      height: 28.125
    });
  }

  React.useEffect(() => {
    clear && clearImage();
  }, [clear])

  React.useEffect(() => {
    if(completedImageUrl) {
      setImg(completedImageUrl);
    }
  }, [completedImageUrl]);

  return (
    <div className='max-w-1/2'>
      <div>
        <InputFile label="Завантажити фото" name="image" onChange={handleImageChange} accept="image/*" errors={errors} value='' />
      </div>
      
      {image && (
        <div className="flex justify-center items-center w-full h-full overflow-auto my-3 shadow-md">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={onCropComplete}
            aspect={aspect} // Змінюємо аспект на 16:9
          >
            <img src={image} ref={imgRef} onLoad={onImageLoad} alt="Crop me" style={{maxWidth: '100%', height: 'auto'}} />
          </ReactCrop>
        </div>  
      )}

      <canvas ref={canvasRef} className='hidden' />
    </div>
  );
};