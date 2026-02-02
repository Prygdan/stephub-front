import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return <div className={cn('max-w-[1190px] mx-auto px-3 md:px-8 lg:px-4', className)}>
    {children}
  </div>;
};
