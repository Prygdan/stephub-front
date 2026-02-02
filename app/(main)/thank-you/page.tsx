import React from 'react';
import { show } from '@/services/pages';
import { Container } from '@/components/shared/container';
import { Description } from '@/components/shared/description';
import { notFound } from 'next/navigation';

export default async function Page() {
  try {
    const data = await show('thank-you');

    return <Container>
        <h1>{data.data.title}</h1>
        <Description description={data.data.content} />
      </Container>
  } catch (error) {
    return notFound();
  }
};