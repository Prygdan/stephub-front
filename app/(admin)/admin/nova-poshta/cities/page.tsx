'use client';

import React from 'react';
import * as citiesAPI from '@/services/delivery/cities';
import { getCities } from '@/services/nova-poshta';
import { DateFormat } from '@/components/shared/date-format';
import { EntityDelivery } from '@/components/shared/entity-delivery';
import { TCiti } from '@/services/delivery/cities';

export default function Page() {
  return (
    <div>
      <EntityDelivery<TCiti>
        api={citiesAPI}
        getEntityDelivery={getCities}
        defaultData={{ id: '', areaRef: '', ref: '', description: '', created_at: '' }}
        jobName='GetDeliveryCities'
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'areaRef', label: 'Area-Ref' },
          { key: 'ref', label: 'Ref' },
          { key: 'description', label: 'Опис' },
          { key: 'created_at', label: 'Дата створення', render: (value) => value ? <DateFormat date={value} /> : '—' }
        ]}
      />
    </div>
  );
};


/* 'use client';

import React from 'react';
import { get, destroy } from '@/services/cities';
import { getCities as fetchCitiesList, getJobStatus } from '@/services/nova-poshta';
import { Loading } from '@/components/shared/loading';
import { InputError } from '@/components/shared/InputError';
import { AlertMessage } from '@/components/shared/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { DateFormat } from '@/components/shared/date-format';
import { TCiti, TJobsStatus } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import PaginationPages from '@/components/shared/pagination-pages';
import { Title } from '@/components/shared/title';

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alertDownload, setAlertDownload] = React.useState<string>('');
  const [cities, setCities] = React.useState<TCiti[] | null>(null);
  const [status, setStatus] = React.useState<TJobsStatus>('success');
  const [page, setPage] = React.useState<number>(1);
  const [lastPage, setLastPage] = React.useState<number>(1);

  const fetchCities = async () => {
    setError(undefined);
    setLoading(true);
    
    await fetchCitiesList()
      .catch(error => {
        if (error.response?.status !== 400) throw error;
        setError(error.response.data.error);
      });

    const status = await getJobStatus('GetDeliveryCities');
    if (status.status === 'error') {
      setError(status.message.replaceAll(/[\[\]"]/g, ''));
      setLoading(false);
      setStatus('error');
    }

    if (status.status === 'processing') {
      setError(undefined);
      setLoading(true);
      setStatus('processing');
    }

    if (status.status === 'success') {
      setError(undefined);
      setLoading(false);
      setAlertDownload(status.message);
      setStatus('success');
      setTimeout(() => getCities(), 3000);
      alert('Скачування запущено в фоновому режимі. Перезагрузіть сторінку через декілька хвилин!');
    }
  };

  const getCities = async () => {
    setLoading(true);
    try {
      const data = await get(page);
      setCities(data.data);
      setLastPage(data.last_page);
    } catch (err) {
      setError("Помилка завантаження міст");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей елемент?')) {
      await destroy(id);
      getCities();
    }
  }

  React.useEffect(() => {
    getCities();
  }, [page]);

  if (loading) return <Loading />;

  return (
    <div className={className}>
      {status === 'processing' && <Loading />}

      {status === 'success' && 
        <div>
          {alertDownload && <AlertMessage title='Операція успішна' message={alertDownload} />}
          
          <Button onClick={fetchCities} disabled={loading} className='relative mt-2'>
            {cities && cities?.length > 0 ? 'Оновити дані' : 'Скачати базу міст'}
          </Button>

          <Title text='Список міст/сіл Нової Пошти' className='mt-2'/>
          
          {error && (
            <div className='mt-2 border border-red-400 rounded-lg px-2 py-1 inline-block'>
              <InputError messages={[error]} />
            </div>
          )}

          <div className='mt-3'> 
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ref</TableHead>
                  <TableHead>Ref Області</TableHead>
                  <TableHead>Опис</TableHead>
                  <TableHead>Дата створення</TableHead>
                  <TableHead className='text-right'>Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.ref}</TableCell>
                    <TableCell>{item.areaRef}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.created_at ? <DateFormat date={item.created_at} /> : '—'}</TableCell>
                    <TableCell className='flex'>
                      <Button size='xs' title='Видалити' onClick={() => handleDelete(item.id)}><Trash2 /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='mt-2 mb-6'>
          {cities && cities?.length > 0 && <PaginationPages active={page} last={lastPage} upload={(page) => setPage(page)} />}
          </div>
        </div>
      }
    </div>
  );
};

export default Page; */