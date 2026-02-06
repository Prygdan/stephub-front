"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface ProductsPaginationProps {
  refetchProducts?: () => Promise<void>;
  lastPage: number;
  className?: string
}

export function ProductsPagination({
  refetchProducts,
  lastPage,
  className
}: ProductsPaginationProps) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const handleOffsetChange = (value: number) => {
    setPage(value);
    setTimeout(() => {
      refetchProducts && refetchProducts();
    }, 300);
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        {page > 1 && (
          <>
            <PaginationItem>
              <Button
                variant="outline"
                className="rounded-none cursor-pointer"
                onClick={() => handleOffsetChange(page - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handleOffsetChange(page - 1)}
                className="rounded-none cursor-pointer"
              >
                {page - 1}
              </Button>
            </PaginationItem>
          </>
        )}
  
        <PaginationItem>
          <Button variant="outline" disabled className="rounded-none cursor-pointer">
            {page}
          </Button>
        </PaginationItem>
        
        {page < lastPage && (
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => handleOffsetChange(page + 1)}
              className="rounded-none cursor-pointer"
            >
              {page + 1}
            </Button>
          </PaginationItem>
        )}

        {page < lastPage && (
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => handleOffsetChange(page + 1)}
              className="rounded-none cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
