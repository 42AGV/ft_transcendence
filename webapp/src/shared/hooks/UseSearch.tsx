import { useEffect, useState } from 'react';
import { useData } from './UseData';

export default function UseSearch<T>(
  search: string,
  fetchFn: () => Promise<T[]>,
) {
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const results = useData(fetchFn);

  useEffect(() => {
    setData([]);
  }, [search]);

  useEffect(() => {
    const newData = results.data;
    if (newData) {
      setData((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length > 0);
    }
  }, [results.data]);

  return { isLoading: results.isLoading, error: results.error, data, hasMore };
}
