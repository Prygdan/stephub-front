import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string | ReactNode;
  className?: string;
}

export const ButtonClient: React.FC<Props> = ({ text, className, ...props }) => {
  return (
    <Button
      variant='outline'
      className={cn(
        'border-2 border-red-700 text-red-700 rounded-2xl hover:text-red-800 hover:bg-red-50 text-[15px]',
        className
      )}
      {...props}
    >
      {text}
    </Button>
  );
};
