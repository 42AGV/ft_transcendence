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
      const lUsersList = await getRows(`${USERS_EP_URL}?search=${search}`);
      setUsersList({ ...lUsersList });
      return lUsersList;
    };
    fetchUsersList().catch((e) => console.error(e));
  }, [search]);

  return (
    <div className="users">
      <div className="users-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="users-search">
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
      <div className="users-rows">
        {usersList.rows && <RowsList rows={usersList.rows} />}
      </div>
      <div className="users-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
