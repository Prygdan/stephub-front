'use client';

import React from 'react';
import { Title } from './title';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loading } from './loading';
import { Button } from '../ui/button';
import { Edit, ListPlus, Trash2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { InputError } from './input-error';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PaginatedResponse } from '@/lib/types';

interface TEntity<T extends { id: string }> {
  title: string;
  className?: string;
  fields: { 
    name: keyof T; 
    label: string; 
    type: 'text' | 'select' | 'file'; 
    options?: { value: string | number; label: string }[]; 
  }[];
  fetchEntity: () => Promise<PaginatedResponse<T>>;
  deleteEntity: (id: string) => Promise<void>;
  storeEntity: (entity: T) => Promise<T>;
  updateEntity: (id: string, entity: T) => Promise<T>;
  offAddBtn?: boolean;
}

export const EntityManager = <T extends { id: string }>({title, fields, fetchEntity, storeEntity, updateEntity, deleteEntity, className, offAddBtn=false}: TEntity<T>) => {
  const [entities, setEntities] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [newEntity, setNewEntity] = React.useState<Partial<T>>({});
  const [editEntity, setEditEntity] = React.useState<Partial<T>>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [image, setImage] = React.useState<FormData | null>(null);
  
  const fetch = async () => {
    try {
      const data = await fetchEntity();
      setEntities(data.data);
    } catch (error) {
      console.error("Помилка при завантаженні:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetch();
  }, []);

  const handleStoreEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();

    Object.entries(newEntity).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    if (image) {
      formData.append('image', image.get('image')!);  // Додаємо обрізане зображення
    }

    try {
      const createdEntity = await storeEntity(formData as unknown as T);
      setEntities([...entities, createdEntity]);
      setNewEntity({});
      setImage(null);  // Очистити зображення після збереження
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Помилка при створенні:", error);
      }
    }
  };

  const handleUpdateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    try {
      const updatedEntity = await updateEntity(editEntity?.id!, editEntity as T);
      
      // Оновлюємо список сутностей
      setEntities((prevEntities) => prevEntities.map((entity) => 
        entity.id === updatedEntity.id ? updatedEntity : entity
      ));
      
      // Закриваємо діалог і очищаємо редаговані дані
      setOpenEdit(false);
      setEditEntity({});
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Помилка при редагуванні:", error);
      }
    }
  };

  const handleDeleteEntity = async (id: string) => {
    try {
      await deleteEntity(id);
      setEntities(entities.filter(entity => entity.id !== id));
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 422)
        throw error;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={className}>
      <Title text={title} className="uppercase" size="sm" />

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Відредагуйте дані</DialogTitle>
            <form onSubmit={handleUpdateEntity}>
              {fields.map((field) => (
                <div key={field.name as string}>
                  <Label>{field.label}</Label>

                  {field.type === 'text' ? (
                    <Input
                      type="text"
                      value={String(editEntity?.[field.name] ?? '')}  // Перевірка на існування editEntity
                      onChange={(e) => 
                        setEditEntity(prev => ({ ...prev, [field.name]: e.target.value } as Partial<T>))
                      }
                      className="w-full"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <Select 
                      value={String(editEntity?.[field.name] ?? '')} 
                      onValueChange={(value) => setEditEntity({ ...editEntity, [field.name]: Number(value)} as Partial<T>)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть значення" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}

                  <InputError messages={errors[field.name as string]} className="mt-2" />
                </div>
              ))}

              <Button size="lg" title="Зберегти" className="w-full mt-4">Зберегти</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        {offAddBtn 
        ?
          entities.length < 1 && 
          <DialogTrigger>
            <div title='Добавити' className='flex gap-1 my-2 bg-black text-white rounded-sm px-2 py-1 text-sm cursor-pointer mt-2'>
              <span>Добавити</span>
              <ListPlus />
            </div>
          </DialogTrigger>
        : <DialogTrigger>
          <div title='Добавити' className='flex gap-1 my-2 bg-black text-white rounded-sm px-2 py-1 text-sm cursor-pointer mt-2'>
            <span>Добавити</span>
            <ListPlus />
          </div>
        </DialogTrigger>
        }
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введіть дані</DialogTitle>
            <form onSubmit={handleStoreEntity} className="space-y-3">
              {fields.map((field) => (
                <div key={field.name as string}>
                  <Label>{field.label}</Label>

                  {field.type === 'text' ? (
                    <Input
                      type="text"
                      value={String(newEntity[field.name] ?? '')}
                      onChange={(e) => setNewEntity({ ...newEntity, [field.name]: e.target.value })}
                      className="w-full"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <Select 
                      value={String(newEntity[field.name] ?? '')} 
                      onValueChange={(value) => setNewEntity({ ...newEntity, [field.name]: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть значення" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                  <InputError messages={errors[field.name as string]} className="mt-2" />
                </div>
              ))}
              <Button size="lg" title="Зберегти" className="w-full mt-4">Зберегти</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((item) => (
                <TableHead key={item.name as string}>{item.label}</TableHead>
              ))}
              <TableHead className='text-right'>Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity.id}>
                {fields.map((field) => (
                  <TableCell key={field.name as string}>
                    {String(entity[field.name] ?? '')}
                  </TableCell>
                ))}

                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="sm"
                      title="Редагувати"
                      onClick={() => {
                        setEditEntity(entity);
                        setOpenEdit(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      size="sm"
                      title="Видалити"
                      onClick={() => handleDeleteEntity(entity.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
