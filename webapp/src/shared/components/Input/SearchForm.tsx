import React, { useEffect, useState } from 'react';
import { Input, InputVariant } from '..';
import { IconVariant } from '../Icon/Icon';
import './SearchForm.css';
import { useData } from '../../hooks/UseData';

type SearchProps<T> = {
  url: string;
  setChange: React.Dispatch<React.SetStateAction<T>>;
};

export default function SearchForm<T>({ url, setChange }: SearchProps<T>) {
  const [search, setSearch] = useState('');
  const results: T | null = useData(`${url}${search}`);
  useEffect(() => {
    if (results) {
      setChange(results);
    }
  }, [results, setChange]);

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
