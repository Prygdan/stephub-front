'use client';

import React from 'react';
import Loading from './loading';
import { useAuth } from '@/hooks/use-auth';
import { notFound } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../styles/admin.css';
import { SearchInput } from '@/components/shared/search/search-input';

interface Props {
  children?: React.ReactNode
}

const RootLayout: React.FC<Props> = ({ children }) => {
  const { user } = useAuth({ middleware: 'auth' })

  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      notFound();
    }
  }, [user])

  if (!user) return <Loading />
  if (user.role !== 'admin') return notFound();

  return (
    <main className="relative">
      <React.Suspense fallback={<Loading />}>
        <NuqsAdapter>
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div className='relative mr-3'>
              <SearchInput 
                href='admin/products' 
                className='absolute w-full md:w-130 top-2' 
                classNameResults='absolute mt-1 z-50' 
                inputClassName='rounded-lg bg-white'
              />
              <div className='relative mt-12 py-3 max-w-300'>
                {children}
              </div>
            </div>
          </SidebarProvider>
        </NuqsAdapter>
      </React.Suspense>
    </main>
  )
}

export default RootLayout;