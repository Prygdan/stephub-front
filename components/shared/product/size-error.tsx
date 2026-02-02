import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircleX, TriangleAlert } from 'lucide-react';

interface Props {
  setSizeError: (val: boolean) => void
  className?: string
}

export const SizeError: React.FC<Props> = ({ className, setSizeError }) => {
  return (
    <div className={cn(className, 'absolute -right-1 top-5 shadow-sm shadow-red-900 border border-red-400 text-sm flex items-center gap-5 bg-red-200 px-6 py-4 rounded-lg')}>
      <div>
        <TriangleAlert className='text-red-900' size={30} />
      </div>
      <div>
        <span className='block font-bold'>Увага</span>
        <span className='block'>Будь ласка, виберіть розмір</span>
      </div>

      <MessageCircleX className='absolute right-1 top-1 cursor-pointer hover:text-red-900 delay-150' onClick={() => setSizeError(false)}/>
  </div>
  );
};
