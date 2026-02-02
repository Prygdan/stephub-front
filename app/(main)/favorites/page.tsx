import React from 'react';
import { Container } from '@/components/shared/container';
import FavoritesClient from './favorites-client';

export default function Page() {
  return (
    <div className={'pt-[50px] md:pt-[80px]'}>
      <Container>
        <FavoritesClient />
      </Container>
    </div>
  );
};
