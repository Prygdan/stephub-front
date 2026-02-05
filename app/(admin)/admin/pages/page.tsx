'use client';

import React from 'react';
import * as API from '@/services/pages';
import { useCrud } from '@/hooks/use-crud';
import { Title } from '@/components/shared/title';
import { DialogForm } from '@/components/shared/dialog-form';
import { InputText } from '@/components/shared/inputs';
import { Tiptap } from '@/components/ui/tiptap/tiptap';
import { MetaTagsForm } from '@/components/shared/meta-tags/meta-tags-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';
import { Description } from '@/components/shared/description';
import { revalidateRelatedCache } from '@/lib/utils';

export default function Page() {
  const defaultPage: API.TPage = {
    id: '',
    slug: '',
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  }
  const { 
    items, item, setItem, create, update, destroy, 
    open, openModal, closeModal, loading, errors 
  } = useCrud<API.TPage>(API, defaultPage)

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = { ...item };
    if (item.id) {
      await update(newItem, item.slug);
      revalidateRelatedCache({pages: true})
    } else {
      create(newItem);
      revalidateRelatedCache({pages: true})
    }
  }

  const handleCloseModal = () => {
    closeModal();
  }

  return (
    <div>
      <Title text="Контент статичних сторінок" size="xl" className="uppercase" />
      <DialogForm
        open={open} 
        openModal={openModal} 
        closeModal={handleCloseModal} 
        item={item} 
        sendForm={sendForm}
        formClassName='min-w-[90%]'>
          <InputText
          label="SLUG"
          name="slug"
          value={item.slug}
          onChange={(e) => setItem({ ...item, slug: e.target.value })}
          errors={errors.slug}
          />
          <InputText
            label="Заголовок"
            name="title"
            value={item.title}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            errors={errors.title}
          />

        <div className="mt-2">
          <Tiptap
            value={item.content} 
            onChange={(html) => { setItem({...item, content: html}) }} 
            />
          {errors.content && <p className="text-red-600">{errors.content}</p>}
        </div>
        <MetaTagsForm
          item={item}
          setItem={(value) => setItem({ ...item, ...value })}
          errors={errors}
        />
      </DialogForm>

      <div className='mt-3'> 
        {items.length > 0 
        ?
        <Table className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Slug/Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className='text-right'>Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <span className='block'>{item.slug}</span>
                  <span className='block'>{item.title}</span>
                </TableCell>
                <TableCell className='whitespace-normal min-w-100'>
                  <Description description={item.content} />
                </TableCell>
                <TableCell className='flex'>
                  {item && <>
                    <Button size={'sm'} title='Редагувати' className='mr-1' onClick={() => openModal(item)}>
                      <PenLine />
                    </Button>
                    <Button size={'sm'} title='Видалити' onClick={() => destroy(item.slug)}>
                      <Trash2 />
                    </Button>
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
  );
};
