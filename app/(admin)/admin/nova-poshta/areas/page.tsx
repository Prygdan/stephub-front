'use client';

import React from 'react';
import * as areasAPI from '@/services/delivery/areas';
import { EntityDelivery } from '@/components/shared/entity-delivery';
import { getAreas } from '@/services/nova-poshta';
import { DateFormat } from '@/components/shared/date-format';

export default function Page() {
  return (
    <div>
      <EntityDelivery<areasAPI.TArea>
        api={areasAPI}
        getEntityDelivery={getAreas}
        defaultData={{ id: '', ref: '', description: '', created_at: '' }}
        jobName="GetDeliveryAreas"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'ref', label: 'Ref' },
          { key: 'description', label: 'Опис' },
          { key: 'created_at', label: 'Дата створення', render: (value) => value ? <DateFormat date={value} /> : '—' }
        ]}
      />
    </div>
  );
};
