'use client';

import React from 'react';
import useSWR from 'swr';
import { TGetJobStatus, TJobs, TJobsStatus } from '@/services/nova-poshta';
import { getJobStatus } from '@/services/nova-poshta';
import { Loading } from './loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { usePaginatedCrud } from '@/hooks/use-paginated-crud';
import { AlertMessage } from './alert';
import { PaginationPages } from './pagination-pages';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface Props<T> {
  api: any
  defaultData: T
  getEntityDelivery: () => Promise<TGetJobStatus>
  jobName: TJobs
  columns: Column<T>[];
  className?: string
}

export const EntityDelivery = <T extends {id: string}>({ className, api, getEntityDelivery, defaultData, jobName, columns }: Props<T>) => {
  const { items, destroy, loading, pagination, handlePageChange } = usePaginatedCrud<T>(api, defaultData);
  const [status, setStatus] = React.useState<TJobsStatus>();
  const [error, setError] = React.useState<string>();
  const [alert, setAlert] = React.useState<string>();
  const [jobId, setJobId] = React.useState<string>();

  const download = async () => {
    try {
      const response = await getEntityDelivery();
      setStatus(response.status);
      setJobId(response.id);
    } catch (error: any) {
      setError(error.response?.data.error || 'Невідома помилка');
    }
  }

  useSWR(status === 'processing' && jobId ? `/api/delivery/get-job-status/${jobId}` : null,
    async () => {
      try {
        const res = await getJobStatus(jobId!);
        setStatus(res.status);
        console.log(res.status);
        if (res.status === 'success') {
          setAlert(res.message);
        } else if (res.status === 'error') {
          setError(res.message);
        }
        return res;
      } catch (error: any) {
        console.error('Помилка при отриманні статусу:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Невідома помилка');
      }
    },
    { refreshInterval: 3000 }
  );

  if(status === 'processing') return <Loading className='absolute left-0 top-0 bg-white w-full h-full'/>

  return (
    <div className={className}>
      {alert && <AlertMessage title='Операція успішна' message={alert} />}
      {error && 
      <AlertMessage 
        title='В процесі скачування виникла помилка!' 
        type='error' 
        message={error} 
        callback={() => setError('')}
        />}

      <Button onClick={download} disabled={loading} className='relative mt-2'>
        {items && items?.length > 0 ? 'Оновити дані' : 'Скачати базу'}
      </Button>

      <div className='mt-3'> 
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key as string}>{col.label}</TableHead>
              ))}
              <TableHead className='text-right'>Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                {columns.map(col => (
                  <TableCell key={col.key as string}>
                    {col.render ? col.render(item[col.key], item) : item[col.key] as React.ReactNode}
                  </TableCell>
                ))}
                <TableCell className='flex'>
                  <Button size='sm' title='Видалити' onClick={() => destroy(item.id)}><Trash2 /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationPages pagination={pagination} handlePageChange={handlePageChange} className='my-6' />
    </div>
  );
};
