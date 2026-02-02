'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface Props {
  content: string
  collback: () => void
  className?: string
}

export const ActiveFilters: React.FC<Props> = ({ content, collback, className }) => {
  return (
    <div 
      className={cn(className, 'text-[16px] inline-flex gap-1 items-center bg-neutral-100 px-2 py-1 rounded-md font-medium')}
      onClick={() => collback()}
      >
      <span>{content}</span>
      <X className='text-white bg-neutral-500 rounded-full p-[2px] font-extrabold' size={17} />
    </div>
  );
};
