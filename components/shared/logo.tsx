import React from 'react';
import Image from 'next/image';

interface Props {
  color?: 'white' | 'black'
  className?: string
}

export const Logo: React.FC<Props> = ({ color='white', className }) => {
  return (
    <div className={className}>
      {color === 'white' 
      ? <div className='flex gap-1'>
          <Image 
            width={49}
            height={38}
            src='/stephub-logo.svg'
            alt='StepHub'
          />
          <div className='font-bold text-[20px]'>
            <span className='block leading-none -ml-[10px]'>Step</span>
            <span className='block leading-none mt-0.5 ml-1'>Hub</span>
          </div>
        </div>
      : <div className='flex gap-1'>
          <Image 
            width={49}
            height={38}
            src='/stephub-logo-black.svg'
            alt='StepHub'
          />
          <div className='font-bold text-[20px]'>
            <span className='block leading-none -ml-[10px]'>Step</span>
            <span className='block leading-none mt-0.5 ml-1'>Hub</span>
          </div>
        </div>
      }
    </div>
  );
};
