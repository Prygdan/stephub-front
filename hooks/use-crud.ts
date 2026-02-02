'use client';

import React from 'react';
import { AxiosResponse, AxiosError } from 'axios';

export interface CrudService<TRead, TCreate = TRead> {
  get: () => Promise<AxiosResponse<TRead[]>>;
  store?: (data: TCreate) => Promise<AxiosResponse<TRead>>;
  update?: (id: string, data: TCreate) => Promise<AxiosResponse<TRead>>;
  destroy?: (id: string) => Promise<AxiosResponse<void>>;
}

export const useCrud = <TRead extends { id?: string }, TCreate = TRead>(
  service: CrudService<TRead, TCreate>,
  defaultData: TCreate
) => {
  const [items, setItems] = React.useState<TRead[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [open, setOpen] = React.useState<boolean>(false);
  const [item, setItem] = React.useState<TCreate>(defaultData);

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await service.get();
      response?.data && response.status === 200 && setItems(response.data);
    } catch (error) {
      handleError(error, 'Помилка при завантаженні даних');
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: TCreate): Promise<TRead | undefined> => {
    setErrors({});
    if (!service.store) {
      console.error('Метод store не визначений');
      return;
    }

    try {
      const response = await service.store(data);
      setAlert({ message: 'Дані збережено!', type: 'success' });
      closeModal();
      await fetch();
      return response.data;
    } catch (error) {
      handleError(error, 'Помилка при створенні');
      return undefined;
    }
  };

  const update = async (data: TCreate, id: string): Promise<TRead | undefined> => {
    setErrors({});
    if (!service.update) {
      console.error('Метод update не визначений');
      return;
    }

    try {
      const response = await service.update(id, data);
      setAlert({ message: 'Дані оновлено!', type: 'success' });
      closeModal();
      await fetch();
      return response.data;
    } catch (error) {
      handleError(error, 'Помилка при оновленні');
      return undefined;
    }
  };

  const destroy = async (id: string): Promise<void> => {
    if (!service.destroy) {
      console.error('Метод destroy не визначений');
      return;
    }

    if (confirm('Ви впевнені, що хочете видалити цей елемент?')) {
      try {
        await service.destroy(id);
        setAlert({ message: 'Дані видалено!', type: 'success' });
        await fetch();
      } catch (error) {
        handleError(error, 'Помилка при видаленні');
      }
    }
  };

  const handleError = (error: unknown, defaultMessage: string) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const message = error.response?.data?.message || defaultMessage;
        setAlert({ message, type: 'error' });
      }
    } else {
      setAlert({ message: defaultMessage, type: 'error' });
      console.log(error);
    }
  };

  const resetForm = () => setItem(defaultData);

  const openModal = (data: TCreate = defaultData) => {
    setItem(data);
    setOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setOpen(false);
    resetForm();
  };

  React.useEffect(() => {
    fetch();
  }, []);

  React.useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  return {
    items,
    item,
    loading,
    alert,
    errors,
    open,

    // Methods
    fetch,
    openModal,
    closeModal,
    create,
    update,
    destroy,
    setItem,
  };
};
