'use client';

import React from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';

import { useSearchState } from '@/hooks/use-search';
import { Input } from '@/components/ui/input';
import { search, SearchedProduct } from '@/services/products';
import { cn } from '@/lib/utils';
import { Loading } from '../loading';
import { Img } from '../img';

interface Props {
  href?: string
  className?: string;
  inputClassName?: string;
  classNameResults?: string;
}

export const SearchInput: React.FC<Props> = ({
  href='product',
  className,
  inputClassName,
  classNameResults,
}) => {
  const { query, setQuery, toggle } = useSearchState();

  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = React.useState<SearchedProduct[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  /* ================= FETCH ================= */
  React.useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setShowResults(true);
        const res = await search(encodeURIComponent(debouncedQuery));
        setResults(res?.data ?? []);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  /* ================= CLICK OUTSIDE ================= */

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ================= RENDER ================= */

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Input
        value={query ?? ''}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) {
            setShowResults(true);
          }
        }}
        placeholder="Шукати товари"
        className={cn(
          'w-full rounded-none bg-[#EEEEEE] py-5 transition-colors',
          query && 'bg-white', inputClassName
        )}
      />

      {showResults && (
        <div
          className={cn(
            'mt-2 w-full bg-white shadow-lg max-h-64 overflow-y-auto',
            classNameResults
          )}
        >
          {loading && (
            <div className='relative w-full h-full'>
              <Loading className="absolute w-full h-full bg-white" />
            </div>
          )}

          {!loading && results.length === 0 && debouncedQuery && (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Нічого не знайдено
            </p>
          )}

          {!loading &&
            results.map((product) => (
              <Link
                key={product.id}
                href={`/${href}/${product.slug}`}
                onClick={() => {
                  setQuery('');
                  setShowResults(false);
                  toggle();
                }}
                className="flex items-center gap-4 px-3 py-2 hover:bg-neutral-100 transition"
              >
                <Img
                  src={product.images[0]?.image}
                  alt={product.name}
                  className="max-w-10 object-cover"
                />
                <span className="text-sm">{product.name}</span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};
