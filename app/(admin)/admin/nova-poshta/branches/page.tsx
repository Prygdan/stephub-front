'use client';

import React from 'react';
import * as branchesAPI from '@/services/delivery/branches'
import { EntityDelivery } from '@/components/shared/entity-delivery';
import { TBranch } from '@/services/delivery/branches';
import { getBranches } from '@/services/nova-poshta';
import { DateFormat } from '@/components/shared/date-format';

export default function Page() {
  return (
    <div>
      <EntityDelivery<TBranch>
        api={branchesAPI}
        getEntityDelivery={getBranches}
        defaultData={{ id: '', cityRef: '', ref: '', description: '', created_at: '' }}
        jobName='GetDeliveryBranches'
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













/* 'use client';

import { EntityDelivery } from '@/components/shared/entity-delivery';
import { get, destroy } from '@/services/branches';
import { TBranch } from '@/lib/types';
import { DateFormat } from '@/components/shared/date-format';
import { getBranches } from '@/services/nova-poshta';

const BranchesPage = () => {
  return (
    <EntityDelivery<TBranch>
      download={getBranches}
      jobName='GetDeliveryBranches'
      title="Список відділень"
      fetchData={(page) => get(page)}
      deleteItem={(id) => destroy(id)}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'ref', label: 'Ref' },
        { key: 'cityRef', label: 'Ref Області' },
        { key: 'description', label: 'Опис' },
        { key: 'created_at', label: 'Дата створення', render: (date) => (date ? <DateFormat date={date} /> : '—') },
      ]}
    />
  );
};

export default BranchesPage; */