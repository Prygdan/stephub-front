import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  status: string
  className?: string
  props?: any
}

export const AuthSessionStatus: React.FC<Props> = ({  status, className, ...props }) => {
  return (
    <>
        {status && (
            <div
                className={cn(className, 'font-medium text-sm text-green-600')}
                {...props}>
                {status}
            </div>
        )}
    </>
  );
};
