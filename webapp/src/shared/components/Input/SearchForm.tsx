import { useEffect, useState } from 'react';
import { Input, InputVariant } from '..';
import { IconVariant } from '../Icon/Icon';
import './SearchForm.css';

type SearchProps<T> = {
  url: string;
  setChange: React.Dispatch<React.SetStateAction<T>>;
};

function useData<T>(url: string): T | null {
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
export default function SearchForm<T>({ url, setChange }: SearchProps<T>) {
  const [search, setSearch] = useState('');
  const results: T | null = useData(`${url}${search}`);
  if (results) {
    setChange(results);
  }

  return (
    <div className="search-form">
      <Input
        variant={InputVariant.DARK}
        iconVariant={IconVariant.SEARCH}
        placeholder="search"
        value={search}
        name="search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
}
