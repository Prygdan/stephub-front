'use client';

import React from 'react';
import * as API from '@/services/seasons';
import { Loading } from '@/components/shared/loading';
import { Title } from '@/components/shared/title';
import { DialogForm } from '@/components/shared/dialog-form';
import { InputText } from '@/components/shared/inputs';
import { useCrud } from '@/hooks/use-crud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';

export default function Page() {
  const defaultData: API.TSeason = {
    id: '',
    name: '',
    slug: '',
  };

  const { 
    items, item, setItem, create, update, loading, open, openModal, closeModal, destroy, errors 
  } = useCrud<API.TSeason>(API, defaultData);

  const handleCloseModal = () => {
    closeModal();
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newItem = { ...item };

    if (item.id) {
      await update(newItem, item.slug);
    } else {
      await create(newItem);
    }
  }

  if (loading) return <Loading />;

  return <div>
    <Title text='Список сезонів' size='xl' className='uppercase' />

    <DialogForm open={open} openModal={openModal} closeModal={handleCloseModal} item={item} sendForm={sendForm}>
      <InputText
        label='Назва'
        name='name'
        value={item.name}
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        errors={errors.name}
        placeholder='Літо'
        required
      />
    </DialogForm>
  
    <div className='mt-3'> 
      {items.length > 0 
      ?
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead className='text-right'>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
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