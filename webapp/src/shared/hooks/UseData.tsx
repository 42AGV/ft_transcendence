import { useEffect, useState } from 'react';

export function useData<T>(url: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
