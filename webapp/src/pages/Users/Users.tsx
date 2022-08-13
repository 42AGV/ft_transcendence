import './Users.css';
import {
  IconVariant,
  Input,
  InputVariant,
  NavigationBar,
  RowItem,
  RowsList,
  RowsListProps,
  SmallAvatar,
} from '../../shared/components';
import React, { useEffect, useState } from 'react';
import {
  USER_URL,
  USERS_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Link } from 'react-router-dom';

interface User {
  username: string;
  email: string;
  avatarId: string | null;
  id: string;
  createdAt: Date;
}

export default function Users() {
  const [usersList, setUsersList] = useState<RowsListProps>({ rows: [] });
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

  const getRows = async (url: string): Promise<RowsListProps> => {
    let rows: RowsListProps = { rows: [] };
    const response = await fetch(url);
    const users: User[] = (await response.json()) ?? [];
    users.forEach((user) => {
      rows.rows?.push({
        iconVariant: IconVariant.ARROW_FORWARD,
        avatarProps: {
          url: user.avatarId
            ? `${USERS_EP_URL}/${user.id}/avatar`
            : WILDCARD_AVATAR_URL,
          status: 'offline',
        },
        onClick: () => {
          window.location.href = `${USERS_URL}/${user.username}`;
        },
        title: user.username,
        subtitle: 'level x',
        key: user.id,
      });
    });
    return rows;
  };

  useEffect(() => {
    const fetchUsersList = async () => {
      const lUsersList = await getRows(`${USERS_EP_URL}`);
      setUsersList({ ...lUsersList });
      return lUsersList;
    };
    fetchUsersList().catch((e) => console.error(e));
  }, []);

  let filteredUsers;

  if (usersList.rows) {
    filteredUsers = filterUsers(usersList.rows, search);
  }
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rows = await getRows(`${USERS_EP_URL}?search=${search}`);
    setUsersList({ ...rows });
    filteredUsers = usersList.rows;
    setSearch('');
  };

  return (
    <div className="users">
      <div className="users-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <form className="users-search" onSubmit={handleOnSubmit}>
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
      <div className="users-rows">
        {filteredUsers && <RowsList rows={filteredUsers} />}
      </div>
      <div className="users-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
