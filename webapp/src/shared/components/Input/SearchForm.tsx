import { useState } from 'react';
import { Input, InputVariant, RowsListProps } from '..';
import { IconVariant } from '../Icon/Icon';
import { getRows } from '../../../pages/Users/Users';
import './SearchForm.css';

type SearchProps = {
  url: string;
  setChange: React.Dispatch<React.SetStateAction<RowsListProps>>;
};

export default function SearchUserForm({ url, setChange }: SearchProps) {
  const [search, setSearch] = useState('');
  const fetchUsersList = async () => {
    const lUsersList = await getRows(`${url}?search=${search}`);
    setChange({ ...lUsersList });
  };
  fetchUsersList().catch((e) => console.error(e));

  return (
    <div className="search-form">
      <Input
        variant={InputVariant.DARK}
        iconVariant={IconVariant.SEARCH}
        placeholder="Search"
        value={search}
        name="search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
}
