'use client';

import React from 'react';
import { EntityManager } from '@/components/shared/entity-manager';
import { get, store, update, destroy } from '@/services/delivery/nova-poshta-key';
import { TNovaPoshatKey } from '@/services/delivery/nova-poshta-key';

export default function Page() {
  return (
    <div>
      <EntityManager<TNovaPoshatKey>
        title="API ключ Нової Пошти"
        fields={[
          { name: 'value', label: "Значення", type: "text" }
        ]}
        fetchEntity={get}
        storeEntity={store}
        deleteEntity={destroy}
        updateEntity={update}
        offAddBtn={true}
        className="mt-6"
      />
    </div>
  );
};
