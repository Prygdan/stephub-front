import React from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  name?:            string
  isName?:          boolean
  children:         React.ReactNode;
  open:             boolean;
  closeModal:       () => void;
  openModal:        () => void;
  item?:            any;
  sendForm:         (e: React.FormEvent) => void;
  className?:       string;
  triggerClassName?:string
  formClassName? :  string
}

export const DialogForm: React.FC<Props> = ({ name='Добавити', isName=true, triggerClassName, children, open, openModal, closeModal, item, sendForm, className, formClassName }) => {
  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen ? closeModal() : null}>
        {isName && <DialogTrigger>
          <div 
            title='Добавити' 
            className={cn(
              'flex items-center gap-2 my-2 bg-slate-900 text-slate-200 hover:bg-slate-200 hover:text-black transition-colors rounded-sm py-1.5 px-8 cursor-pointer',
              triggerClassName
            )} 
            onClick={() => openModal()}
            >
            <span className='block text-[14px] uppercase'>{name}</span>
            <ListPlus size={24} className='block' />
          </div>
        </DialogTrigger>}
        <DialogContent className={cn(`max-h-[85vh] overflow-y-auto`, formClassName)}>
          <DialogHeader>
            <DialogTitle>{item && item.id ? 'Редагувати' : 'Введіть дані'}</DialogTitle>
            <form onSubmit={sendForm} className='space-y-3 text-left'>
              {children}
              <Button size={'lg'} title='Зберегти' className='w-full mt-2 bg-slate-700 cursor-pointer'>Зберегти</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
