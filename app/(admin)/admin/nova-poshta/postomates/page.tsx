'use client';

import React from 'react';
import * as postomatesAPI from '@/services/delivery/postomates';
import { TPostomat } from '@/services/delivery/postomates';
import { getPostomates } from '@/services/nova-poshta';
import { DateFormat } from '@/components/shared/date-format';
import { EntityDelivery } from '@/components/shared/entity-delivery';

export default function Page() {
  return (
    <div>
      <EntityDelivery<TPostomat>
        api={postomatesAPI}
        getEntityDelivery={getPostomates}
        defaultData={{ id: '', cityRef: '', ref: '', description: '', created_at: '' }}
        jobName='GetDeliveryPostomates'
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'cityRef', label: 'City-Ref' },
          { key: 'ref', label: 'Ref' },
          { key: 'description', label: 'Опис' },
          { key: 'created_at', label: 'Дата створення', render: (value) => value ? <DateFormat date={value} /> : '—' }
        ]}
      />
    </div>
  );
};
