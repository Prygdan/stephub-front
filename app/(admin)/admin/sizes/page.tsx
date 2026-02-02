'use client';

import React from 'react';
import * as API from '@/services/sizes';
import { Loading } from '@/components/shared/loading';
import { Title } from '@/components/shared/title';
import { DialogForm } from '@/components/shared/dialog-form';
import { InputText } from '@/components/shared/inputs';
import { useCrud } from '@/hooks/use-crud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';

export default function Page() {
  const defaultData: API.TSize = {
    id: '',
    value_eu: '',
    value_cm: '',
  };

  const { 
    items, item, setItem, create, update, loading, open, openModal, closeModal, destroy, errors 
  } = useCrud<API.TSize>(API, defaultData);

  const handleCloseModal = () => {
    closeModal();
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newItem = { ...item };

    if (item.id) {
      await update(newItem, item.id);
    } else {
      await create(newItem);
    }
  }

  if (loading) return <Loading />;

  return <div>
    <Title text='Список розмірів' size='xl' className='uppercase' />

    <DialogForm open={open} openModal={openModal} closeModal={handleCloseModal} item={item} sendForm={sendForm}>
      <InputText
        label='Розмір-EU'
        name='name'
        value={item.value_eu}
        onChange={(e) => setItem({ ...item, value_eu: e.target.value })}
        errors={errors.value_eu}
        placeholder='42'
        required
      />
      <InputText
        label='Розмір-CM'
        name='name'
        value={item.value_cm}
        onChange={(e) => setItem({ ...item, value_cm: e.target.value })}
        errors={errors.value_cm}
        placeholder='26.5'
      />
    </DialogForm>
  
    <div className='mt-3'> 
      {items.length > 0 
      ?
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Розмір-EU</TableHead>
            <TableHead>Розмір-CM</TableHead>
            <TableHead className='text-right'>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.value_eu}</TableCell>
              <TableCell>{item.value_cm}</TableCell>
              <TableCell className='flex'>
                {item && <>
                  <Button size={'sm'} title='Редагувати' className='mr-1' onClick={() => openModal(item)}><PenLine /></Button>
                  <Button size={'sm'} title='Видалити' onClick={() => destroy(item.id)}><Trash2 /></Button>
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