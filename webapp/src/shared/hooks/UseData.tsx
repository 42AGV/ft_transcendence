import { useEffect, useState } from 'react';

export function useData<T>(
  url: string,
  initialState: T,
  typeChecker: (instance: any) => boolean,
) {
  const [data, setData] = useState<T>(initialState);

  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          if (!typeChecker(json)) {
            throw new Error('Unexpected response format');
          }
          setData(json);
        }
      })
      .catch((e) => console.error(e));
    return () => {
      ignore = true;
    };
  }, [url, typeChecker]);

  return data;
}
