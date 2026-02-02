import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  title:      string
  className?: string
}

export const ListTitle: React.FC<Props> = ({ title, className }) => {
  return (
    <div className={cn('relative text-[20px] uppercase font-medium', className)}>
      <span className="inline-block after:content-[''] after:block after:w-full after:h-[3px] after:bg-black after:mt-2">
        {title}
      </span>
    </div>
  );
};
