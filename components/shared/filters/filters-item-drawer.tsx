'use client'

import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ChevronDown, RotateCcw, X } from 'lucide-react';
import { ButtonClient } from '../button-client';

interface Props {
  triger: string
  title: string
  children: React.ReactNode
  setFilters: boolean
  clear: () => void
  className?: string
}

export const FiltersItemDrawer: React.FC<Props> = ({ triger, title, children, clear, setFilters, className }) => {
  const [ open, setOpen ] = React.useState(false);

  return (
    <div className={className}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className={`flex gap-0.5 rounded-none items-center border px-2 py-1 ${!setFilters ? 'border-neutral-400' : 'border-[#95C0A4] shadow-sm shadow-[#95C0A4]'}`}>
          <span className='max-w-full whitespace-nowrap'>{triger}</span>
          <ChevronDown size={15} className={`block text-neutral-500 ${open ? 'rotate-180' : ''}`} />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='border-b border-b-neutral-300'>
            <DrawerTitle className='flex justify-between items-center'>
              <span>{title}</span>
              <DrawerClose>
                <X size={25}/>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div className='py-5 px-3 overflow-y-auto'>
            {children}
          </div>
          <DrawerFooter className='border-t border-t-neutral-300'>
            <div onClick={() => {clear(); setOpen(false);}}>
              <ButtonClient text={<><RotateCcw /> Скинути</>} />
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
