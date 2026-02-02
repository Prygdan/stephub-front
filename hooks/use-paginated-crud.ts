'use client';

import React from 'react';
import { PaginatedResponse } from '@/lib/types';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface PaginatedCrudService<T> { 
  get:      (page?: number) => Promise<AxiosResponse<PaginatedResponse<T>>>;
  store?:   (data: T) => Promise<AxiosResponse<T>>;
  update?:  (id: string, data: T) => Promise<AxiosResponse<T>>;
  destroy?: (id: string) => Promise<AxiosResponse<void>>;
}

export const usePaginatedCrud = <T extends { id?: string }>(
  service:      PaginatedCrudService<T>,
  defaultData:  T
) => {
  const [items, setItems]           = React.useState<T[]>([]);
  const [pagination, setPagination] = React.useState<{
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
  }>({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
    total: 0,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert]     = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors]   = React.useState<Record<string, string[]>>({});
  const [open, setOpen]       = React.useState<boolean>(false);
  const [item, setItem]       = React.useState<T>(defaultData);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const response = await service.get(page);
      const data = response.data;

      setItems(data.data);
      setPagination({
        current_page:   data.current_page,
        last_page:      data.last_page,
        next_page_url:  data.next_page_url,
        prev_page_url:  data.prev_page_url,
        total:          data.total,
      });
    } catch (error) {
      handleError(error, 'Помилка при завантаженні');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());

      router.push(`${pathname}?${params.toString()}`);
      fetch(newPage);
    }
  };

  const create = async (data: T): Promise<T | undefined> => {
    setErrors({});
    if (!service.store) {
      console.error('Метод store не визначений');
      return;
    }

    try {
      const response = await service.store(data);
      setAlert({ message: 'Дані збережено!', type: 'success' });
      closeModal();
      await fetch(pagination.current_page); // Оновлюємо поточну сторінку
      return response.data;
    } catch (error) {
      handleError(error, 'Помилка при створенні');
      return undefined;
    }
  };

  const update = async (data: T, id: string): Promise<T | undefined> => {
    setErrors({});
    if (!service.update || !data.id) {
      console.error('Метод update не визначений або відсутній ID');
      return;
    }

    try {
      const response = await service.update(id, data);
      setAlert({ message: 'Дані оновлено!', type: 'success' });
      closeModal();
      await fetch(pagination.current_page);
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
        await fetch(pagination.current_page);
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

  const openModal = (data: T = defaultData) => {
    setItem(data);
    setOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setOpen(false);
    resetForm();
  };

  React.useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    fetch(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
    pagination,

    // Methods
    fetch,
    handlePageChange,
    openModal,
    closeModal,
    create,
    update,
    destroy,
    setItem,
  };
};
