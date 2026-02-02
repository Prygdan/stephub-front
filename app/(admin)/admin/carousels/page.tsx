'use client';

import React from 'react';
import Loading from '../../loading';
import * as CarouselsAPI from '@/services/carousels';
import { useCrud } from '@/hooks/use-crud';
import { Title } from '@/components/shared/title';
import { DialogForm } from '@/components/shared/dialog-form';
import { InputCheckbox, InputSelect, InputText } from '@/components/shared/inputs';
import { CropImage } from '@/components/shared/crop-image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { Img } from '@/components/shared/img';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/filters/use-categories';

export default function Page() {
  const defaultItem: CarouselsAPI.TCarouselCreate = {
    id: '',
    page: '',
    category_id: '',
    items: [],
  }

  const { items, item, setItem, create, loading, open, openModal, closeModal, destroy, errors } =
    useCrud<CarouselsAPI.TCarousel, CarouselsAPI.TCarouselCreate>(CarouselsAPI, defaultItem);
  const [image, setImage] = React.useState<string | null>(null);
  const [imageMobile, setImageMobile] = React.useState<string | null>(null);
  const [selectFor, setSelectFor] = React.useState<'home' | 'category'>();
  
  const { loading: loadingCategories, categories } = useCategories(true);

  const handleAddImage = () => {
    if (image) {
      setItem({
        ...item,
        items: [...(item.items || []), { image: image, image_mobile: imageMobile }]
      });
      setImage(null);
      setImageMobile(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setItem({
      ...item,
      items: item.items?.filter((_, i) => i !== index) || []
    });
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await create(item);
  };

  const handleCloseModal = () => {
    closeModal();
    setImage(null);
    setImageMobile(null);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Title text='Каруселі' size='xl' className='uppercase' />

      <DialogForm open={open} openModal={openModal} closeModal={handleCloseModal} item={item} sendForm={sendForm}>
        <Label className='mt-3'>Виберіть розміщення каруселі</Label>
        <div className='flex gap-2'>
          <InputCheckbox 
            onChange={() => setSelectFor('home')}
            value={selectFor === 'home' ? true : false}
            label="Головна Сторінка"
            name="selectPage"
            errors={errors.page}
          />
          <InputCheckbox 
            onChange={() => setSelectFor('category')}
            value={selectFor === 'category' ? true : false}
            label="Для категорії"
            name="selectSubcat"
            errors={errors.page}
          />
        </div>

        {categories && selectFor === 'category' && <InputSelect
          label="Сторіна категорії"
          name="category_id"
          value={item.category_id ?? ''}
          onChange={(value) => setItem({ ...item, category_id: value })}
          selectItems={categories}
          errors={errors.category_id}
          placeholder="Оберіть категорію"
          className="w-full"
          loading={loadingCategories}
        />}

        <div className="mt-4">
          <CropImage setImg={setImage} errors={errors.items} aspect={3.25/1} />
          <Button type="button" variant='outline' className="mt-4" onClick={handleAddImage}>Додати зображення</Button>
        </div>
        
        <div className="mt-4">
          {item.items && item.items.length > 0 && item.items.map((img, index) => (
            <div key={index} className="flex items-center mt-2">
              <img src={img.image} alt={`Slide ${index}`} width={100} height={50} />
              <Button type="button" className="ml-4" variant="destructive" onClick={() => handleRemoveImage(index)}>Видалити</Button>
            </div>
          ))}
        </div>

      </DialogForm>

      <div className='mt-3'>
        {items.length > 0 ?
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Розміщення</TableHead>
                <TableHead>Слайди</TableHead>
                <TableHead className='text-right'>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((carousel) => (
                <TableRow key={carousel.id}>
                  <TableCell>{carousel.id}</TableCell>
                  <TableCell>
                    {categories?.find((cat) => cat.id === carousel.category_id)?.name || 'Головна'}
                  </TableCell>
                  <TableCell>
                    {carousel.items.map((item, index) => (<div key={item.id} className={`${index <= carousel.items.length -1 && 'mb-3'}`}>
                      <Img className='max-w-[250px]' src={item.image} alt={item.image} />
                    </div>))}
                  </TableCell>
                  <TableCell className='flex justify-end'>
                    <Button size={'sm'} title='Видалити' onClick={() => destroy(carousel.id)}><Trash2 /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          : <span>Записи відсутні</span>
        }
      </div>
    </div> 
  );
};