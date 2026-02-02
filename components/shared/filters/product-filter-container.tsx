'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus, X } from 'lucide-react';

interface Props {
  children: React.ReactNode
  title: string
  clearChange: () => void
  setFilters: boolean
  startOpen?: boolean
  className?: string
}

export const ProductFilterContainer: React.FC<Props> = (
  { children, startOpen=false, title, setFilters, clearChange, className }
) => {
  const [ open, setOpen ] = React.useState<boolean>(startOpen);

  const toggleOpen = () => {
    open ? setOpen(false) : setOpen(true);
  }

  return (  
    <div className={cn(className, 'border-t border-neutral-100')}>
      <div className='flex justify-between py-3'>
        <div className='flex items-center gap-1'>
          <span className="font-bold">{title}</span>
          {setFilters && 
            <X size={14} className='bg-blue-400 text-white rounded-full p-[2px] cursor-pointer' onClick={clearChange} />
          }
        </div>
        <div className='cursor-pointer' onClick={toggleOpen}>
          {!open ? <Plus className='text-[#A2A2A2]' /> : <Minus className='text-[#A2A2A2]' />}
        </div>
      </div>
      {open &&
      <div className='mb-2 mt-[-10px]'>
        {children}
      </div>
      }
    </div>
  );
};
