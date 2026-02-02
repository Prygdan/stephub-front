import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string
}

export const ListTemplate: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
};

