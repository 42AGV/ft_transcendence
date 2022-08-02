import { useState } from 'react';
import { Input, InputVariant, RowItem } from '../';
import { IconVariant } from '../Icon/Icon';
import RowsList from '../RowsList/RowsList';
import './SearchUserForm.css';

type SearchProps = {
  users: RowItem[];
};

export default function SearchUserForm({ users }: SearchProps) {
  const [search, setSearch] = useState('');
  const filterUsers = (users: RowItem[], query: string) => {
    if (!query) {
      return users;
    }
    return users.filter((user) => {
      const username = user.title!.toLowerCase();
      return username.includes(query);
    });
  };
  const filteredUsers = filterUsers(users, search);

  return (
    <>
      <form className="search-user-form">
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
      </form>
      <RowsList rows={filteredUsers}></RowsList>
    </>
  );
}
