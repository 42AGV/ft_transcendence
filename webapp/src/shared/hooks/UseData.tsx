import * as React from 'react';
import { useEffect, useState } from 'react';

type DataReturn<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useData<T>(
  fetchFn: () => Promise<T>,
  loggerParam?: (arg0: any) => void,
): DataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loggerLocal = React.useCallback((msg: any) => console.log(msg), []);
  const logger = loggerParam ? loggerParam : loggerLocal;

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
