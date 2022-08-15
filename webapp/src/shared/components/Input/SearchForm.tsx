import { useEffect, useState } from 'react';
import { Input, InputVariant, RowsListProps } from '..';
import { IconVariant } from '../Icon/Icon';
import { getRows } from '../../../pages/Users/Users';
import './SearchForm.css';

type SearchProps = {
  url: string;
  setChange: React.Dispatch<React.SetStateAction<RowsListProps>>;
};

export default function SearchForm({ url, setChange }: SearchProps) {
  const [search, setSearch] = useState('');
  useEffect(() => {
    const fetchRowsList = async () => {
      const lRowsList = await getRows(`${url}?search=${search}`);
      setChange({ ...lRowsList });
    };
    fetchRowsList().catch((e) => console.error(e));
  }, [search, setChange, url]);

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
