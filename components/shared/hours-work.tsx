import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string
}

export const HoursWork: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <span className="block text-center font-medium tracking-widest text-[12px]">Режим роботи</span>
      <div className="flex justify-center font-light text-2xl">
        <span className="block">10</span>
        <span className="block text-xs">00</span>
        <span className="block mx-1">-</span>
        <span className="block">19</span>
        <span className="block text-xs">00</span>
      </div>
      <span className="block mt-2 text-xs font-extralight">СБ: 09:00-14:00</span>
      <span className="block text-xs font-extralight">НД: Вихідний</span>
    </div>
  );
};
