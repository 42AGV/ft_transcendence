import React from 'react';
import { Input, InputVariant } from '..';
import { IconVariant } from '../Icon/Icon';
import './SearchForm.css';

type SearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function SearchForm({ search, onSearchChange }: SearchProps) {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="search-form">
      <Input
        variant={InputVariant.DARK}
        iconVariant={IconVariant.SEARCH}
        placeholder="search"
        value={search}
        name="search"
        onChange={handleSearch}
      />
    </div>
  );
}
