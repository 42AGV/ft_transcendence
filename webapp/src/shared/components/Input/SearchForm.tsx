import { useEffect, useState } from 'react';
import { Input, InputVariant, RowsListProps } from '..';
import { IconVariant } from '../Icon/Icon';
import './SearchForm.css';

type SearchProps = {
  url: string;
  setChange: React.Dispatch<React.SetStateAction<RowsListProps>>;
  getValues: Function;
};

export default function SearchForm({ url, setChange, getValues }: SearchProps) {
  const [search, setSearch] = useState('');
  useEffect(() => {
    const fetchList = async () => {
      const lList = await getValues(`${url}?search=${search}`);
      setChange({ ...lList });
    };
    fetchList().catch((e) => console.error(e));
  }, [search, setChange, url, getValues]);

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
