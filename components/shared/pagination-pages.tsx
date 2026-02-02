'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from '@/lib/utils';

export type PaginationData = {
  current_page: number;
  last_page: number;
  next_page_url?: string | null;
}

interface Props {
  pagination: PaginationData;
  handlePageChange: (page: number) => void;
  className?: string 
}

export const PaginationPages: React.FC<Props> = ({ pagination, handlePageChange, className }) => {
  const { current_page, last_page } = pagination;

  const renderPageLink = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        href={`?page=${page}`}
        isActive={current_page === page}
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(page);
        }}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const pagesToShow = () => {
    const pages = [];

    const leftSide = Math.max(1, current_page - 2);
    const rightSide = Math.min(last_page, current_page + 2);

    for (let i = leftSide; i <= rightSide; i++) {
      pages.push(renderPageLink(i));
    }

    if (leftSide > 2) {
      pages.unshift(<PaginationEllipsis key="left-ellipsis" />);
      pages.unshift(renderPageLink(1));
    }

    if (rightSide < last_page - 1) {
      pages.push(<PaginationEllipsis key="right-ellipsis" />);
      pages.push(renderPageLink(last_page));
    }

    return pages;
  };

  return (
    <div className={cn(className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${current_page - 1}`}
              onClick={(e) => {
                e.preventDefault();
                if (current_page > 1) handlePageChange(current_page - 1);
              }}
            />
          </PaginationItem>

          {pagesToShow()}

          <PaginationItem>
            <PaginationNext
              href={`?page=${current_page + 1}`}
              onClick={(e) => {
                e.preventDefault();
                if (current_page < last_page) handlePageChange(current_page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
