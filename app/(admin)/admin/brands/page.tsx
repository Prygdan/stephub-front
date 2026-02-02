'use client';

import React from 'react';
import * as brandsAPI from '@/services/brands';
import { Loading } from '@/components/shared/loading';
import { Title } from '@/components/shared/title';
import { DialogForm } from '@/components/shared/dialog-form';
import { InputCheckbox, InputText } from '@/components/shared/inputs';
import { useCrud } from '@/hooks/use-crud';
import { CropImage } from '@/components/shared/crop-image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';
import { Img } from '@/components/shared/img';
import { ALL_FILTERS } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export default function Page() {
  const defaultBrand: brandsAPI.TBrand = {
    id: '',
    name: '',
    slug: '',
    image: '',
    in_popular: false,
    allowed_filters: [],
  };

  const { 
    items, item, setItem, create, update, loading, open, openModal, closeModal, destroy, errors 
  } = useCrud<brandsAPI.TBrand>(brandsAPI, defaultBrand);
  const [ image, setImage ] = React.useState<string | null>(null);

  const handleCloseModal = () => {
    closeModal();
    setImage(null);
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newItem = { ...item, image: image };

    if (item.id) {
      await update(newItem, item.slug);
      setImage(null);
    } else {
      await create(newItem);
      setImage(null);
    }
  }

  if (loading) return <Loading />;

  return <div>
    <Title text='Список брендів' size='xl' className='uppercase' />

    <DialogForm open={open} openModal={openModal} closeModal={handleCloseModal} item={item} sendForm={sendForm}>
      <InputText
        label='Назва бренду'
        name='name'
        value={item.name}
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        errors={errors.name}
        placeholder='Nike'
        required
      />
      <div className="mt-4">
        <CropImage setImg={setImage} errors={errors.image} aspect={1/1} />
      </div>
      <InputCheckbox 
        label='В списку популярних'
        name='in_popular'
        value={item.in_popular}
        onChange={(e) => setItem({ ...item, in_popular: Boolean(e)})}
        errors={errors.in_popular}
      />
      <div className='mt-1'>
        <Label className='mb-2'>Пункти фільтрації</Label>
        <div className='grid grid-cols-3 gap-2'>
          {ALL_FILTERS.map((filter) => (<div key={filter.value}>
            <InputCheckbox
              label={filter.label}
              name={filter.value}
              value={item.allowed_filters?.includes(filter.value) ?? false}
              onChange={(e) => {
                if(e) {
                  setItem({
                    ...item,
                    allowed_filters: [...(item.allowed_filters || []), filter.value]
                  })
                } else {
                  setItem({
                    ...item,
                    allowed_filters: item.allowed_filters?.filter((f) => f !== filter.value) ?? ['']
                  })
                }
              }}
              errors={errors.allowed_filters}
            />
          </div>))}
        </div>
      </div>
    </DialogForm>
  
    <div className='mt-3'> 
      {items.length > 0 
      ?
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Логотип</TableHead>
            <TableHead>В списку популярних</TableHead>
            <TableHead className='text-right'>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className='max-w-[100px]'>
                {item.image 
                ? <Img src={`${item.image}?t=${new Date().getTime()}`} alt={item.name} />
                : <span>Логотип відсутній</span>
                }
              </TableCell>
              <TableCell className='text-center'>{item.in_popular ? 'Так' : 'Ні'}</TableCell>
              <TableCell className='flex'>
                {item && <>
                  <Button size={'sm'} title='Редагувати' className='mr-1' onClick={() => openModal(item)}><PenLine /></Button>
                  <Button size={'sm'} title='Видалити' onClick={() => destroy(item.slug)}><Trash2 /></Button>
                </>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      : <span>Записи відсутні</span>
      }
    </div>
  </div>
}