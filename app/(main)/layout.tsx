import React from 'react';
import Loading from './loading';
import '../styles/front.css';
import { Header } from '@/components/shared/header/header';
import { getSSR as getCategories } from '@/services/categories';
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Footer } from '@/components/shared/footer';

interface Props {
  children?: React.ReactNode
}

const RootLayout: React.FC<Props> = async ({ children }) => {
  const categories = await getCategories();

  return (
    <main className="relative">
      <Header categories={categories} />
      <div className='mt-[64px] md:mt-[96px]'>
        <NuqsAdapter>
          <React.Suspense fallback={<Loading />}>
            {children}
          </React.Suspense>
        </NuqsAdapter>
      </div>
      <Footer categories={categories} className='mt-12' />
    </main>
  )
}

export default RootLayout;