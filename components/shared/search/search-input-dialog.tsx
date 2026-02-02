'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSearchState } from '@/hooks/use-search';
import { SearchInput } from './search-input';

export const SearchInputDialog: React.FC = () => {
  const { open, toggle } = useSearchState();

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="rounded-none max-w-lg p-4 overflow-y-auto">
        <DialogTitle className="uppercase mb-4 grow">
          Пошук
        </DialogTitle>

        <SearchInput className='grow-0 pb-15' />
      </DialogContent>
    </Dialog>
  );
};
