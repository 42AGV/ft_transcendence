import { useEffect, useState, useCallback } from 'react';
import { useData } from './UseData';
import { useSearchContext } from '../context/SearchContext';

export default function UseSearch<T>(
  fetchFn: (requestParams: {}) => Promise<T[]>,
  maxEntries: number,
) {
  type SearchResult<T> = {
    data: T[];
    hasMore: boolean;
  };

  const [result, setResult] = useState<SearchResult<T>>({
    data: [],
    hasMore: false,
  });

  const { query } = useSearchContext();

  const getData = useCallback(() => {
    return fetchFn(query);
  }, [fetchFn, query]);

  const { data, error, isLoading } = useData(getData);

  useEffect(() => {
    if (data && data.length > 0) {
      if (query.offset > 0) {
        setResult((prevResult) => ({
          data: [...prevResult.data, ...data],
          hasMore: data.length === maxEntries,
        }));
      } else {
        setResult({
          data: [...data],
          hasMore: data.length === maxEntries,
        });
      }
    } else {
      setResult({
        data: [],
        hasMore: false,
      });
    }
  }, [data]);

  return { isLoading, error, result };
}
