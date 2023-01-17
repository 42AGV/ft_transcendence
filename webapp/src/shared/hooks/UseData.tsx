import { useEffect, useState } from 'react';

type DataReturn<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useData<T>(
  fetchFn: () => Promise<T>,
  logger: (arg0: any) => void = console.error,
): DataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    fetchFn()
      .then((result) => {
        if (!ignore) {
          setData(result);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error);
          setData(null);
          logger(error);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [logger, fetchFn]);

  return { data, isLoading, error };
}
