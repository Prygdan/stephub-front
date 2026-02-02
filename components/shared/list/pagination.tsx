"use client";

import React from 'react';
import { parseAsInteger, useQueryState } from "nuqs";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  refetch?: () => Promise<void>;
  lastPage: number;
  className?: string
}

export const Pagination: React.FC<Props> = ({ refetch, lastPage, className }) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [delta, setDelta] = React.useState(3); // скільки сторінок показуємо навколо поточної

  const mobile = useIsMobile();

  React.useEffect(() => {
    if(mobile) {
      setDelta(1)
    } else {
      setDelta(3)
    }
  }, [mobile]);

  const handleOffsetChange = (value: number) => {
    setPage(value);
    setTimeout(() => {
      refetch && refetch();
    }, 300);
  };

  const pageNumbers: (number | string)[] = [];
  const left = Math.max(1, page - delta);
  const right = Math.min(lastPage, page + delta);

  // Перша сторінка
  if (left > 1) {
    pageNumbers.push(1);
    if (left > 2) pageNumbers.push('…');
  }

  // Сторінки навколо поточної
  for (let i = left; i <= right; i++) {
    pageNumbers.push(i);
  }

  // Остання сторінка
  if (right < lastPage) {
    if (right < lastPage - 1) pageNumbers.push('…');
    pageNumbers.push(lastPage);
  }

  return (
    <ShadcnPagination className={className}>
      <PaginationContent>
        {/* Previous */}
        {page > 1 && (
          <PaginationItem>
            <Button variant="outline" onClick={() => handleOffsetChange(page - 1)} className='text-black cursor-pointer'>
              <ChevronLeft /> 
            </Button>
          </PaginationItem>
        )}

        {/* Pages */}
        {pageNumbers.map((num, idx) =>
          num === '…' ? (
            <span key={`dots-${idx}`} className="px-0.5 md:px-2 text-slate-300">…</span>
          ) : (
            <PaginationItem key={num}>
              <Button
                variant={num === page ? 'secondary' : "outline"}
                onClick={() => handleOffsetChange(num as number)}
                disabled={num === page}
                className='text-black cursor-pointer'
                size='icon'
              >
                {num}
              </Button>
            </PaginationItem>
          )
        )}

        {/* Next */}
        {page < lastPage && (
          <PaginationItem className='cursor-pointer'>
            <Button variant="outline" onClick={() => handleOffsetChange(page + 1)} className='text-black cursor-pointer'>
              <ChevronRight />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </ShadcnPagination>
  );
};
