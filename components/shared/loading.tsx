import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export const Loading: React.FC<Props> = ({ className = 'min-h-screen', width = 54, height = 54 }) => {
  return (
    <div className={cn(className, 'flex items-center justify-center bg-white')}>
      <div
        className="relative border-4 border-gray-200 rounded-full animate-spin"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderTopColor: 'rgb(0 0 0)', 
        }}
      />
    </div>
  );
};
