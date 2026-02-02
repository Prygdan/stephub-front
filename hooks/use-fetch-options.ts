import React from 'react';

interface Props<T> {
  fetcher: (props?: string) => Promise<{data: T[]}>
  enabled?: boolean
  props?: string
}

export const useFetchOptions = <T>({ fetcher, enabled = false, props }: Props<T>) => {
  const [items, setItems]     = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    async function fetch() {
      try {
        setLoading(true); setError(null);
        const response = await fetcher(props);
        setItems(response.data);
      } catch (error) {
        console.log(error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    
    fetch();
  }, [enabled])
  
  return { items, loading, error };
};
