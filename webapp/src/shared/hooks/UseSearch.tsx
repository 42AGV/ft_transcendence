import { useEffect, useState, useCallback } from 'react';
import { useData } from './UseData';
import { useSearchContext } from '../context/SearchContext';

export default function UseSearch<T>(
  fetchFn: (requestParams: {}) => Promise<T[]>,
) {
  type SearchResult<T> = {
    data: T[];
    hasMore: boolean;
  };

  const [result, setResult] = useState<SearchResult<T>>({
    data: [],
    hasMore: false,
  });

  // revisar esto, mover esta logica dentro del contexto?
  const { query } = useSearchContext();

  const getData = useCallback(() => {
    return fetchFn(query);
  }, [fetchFn, query]);

  const { data, error, isLoading } = useData(getData);

  useEffect(() => {
    if (data && data.length > 0) {
      //setResult((prevResult) => [...prevResult, ...data]);
      setResult({
        data: [...data],
        hasMore: data.length > 0,
      });
    } else {
      setResult({
        data: [],
        hasMore: false,
      });
    }
  }, [data]);

  return { isLoading, error, result };
}
