import React, { useCallback, useEffect, useState } from 'react';
import { Input, InputVariant } from '..';
import { IconVariant } from '../Icon/Icon';
import './SearchForm.css';
import { useData } from '../../hooks/UseData';

type SearchProps<T> = {
  fetchFn: (...args: any[]) => Promise<T>;
  setChange: React.Dispatch<React.SetStateAction<T>>;
};

export default function SearchForm<T>({ fetchFn, setChange }: SearchProps<T>) {
  const [search, setSearch] = useState('');
  const memoizedFetchFn = useCallback(
    () => fetchFn({ search }),
    [fetchFn, search],
  );
  const { data } = useData<T>(memoizedFetchFn);

  useEffect(() => {
    if (data) {
      setChange(data);
    }
  }, [data, setChange]);

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
