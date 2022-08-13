import './Users.css';
import {
  IconVariant,
  Input,
  InputVariant,
  NavigationBar,
  RowsList,
  RowsListProps,
  SmallAvatar,
} from '../../shared/components';
import {
  USER_URL,
  USERS_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Link } from 'react-router-dom';
import { useData } from '../../shared/hooks/UseData';
import React, { useEffect, useState } from 'react';

interface User {
  readonly username: string;
  readonly email: string;
  readonly avatarId: string | null;
  readonly id: string;
  readonly createdAt: Date;
}

export default function Users() {
  const GetRows = (url: string): RowsListProps => {
    const users = useData(url) ?? [];
    return {
      rows: users.map((user: User) => {
        return {
          iconVariant: IconVariant.ARROW_FORWARD,
          avatarProps: {
            url: user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
              : WILDCARD_AVATAR_URL,
            status: 'offline',
          },
          url: `${USERS_URL}/${user.username}`,
          title: user.username,
          subtitle: 'level x',
          key: user.id,
        };
      }),
    };
  };
  const rowProps = GetRows(USERS_EP_URL);
  const [filteredUsersList, setFilteredUsersList] = useState<RowsListProps>({});
  const [searchInput, setSearchInput] = useState<string>('');

  const searchInputChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    const filterUsersList = () => {
      const userRows = (rowProps.rows ?? []).filter(
        (user = { title: '', key: '' }) => {
          return user.title?.includes(searchInput) ?? true;
        },
      );
      setFilteredUsersList({ rows: userRows });
    };
    filterUsersList();
  }, [searchInput, rowProps]);

  return (
    <div className="users">
      <div className="users-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="users-search">
        <Input
          iconVariant={IconVariant.SEARCH}
          variant={InputVariant.DARK}
          placeholder="search"
          onChange={searchInputChanges}
        />
      </div>
      <div className="users-rows">
        {filteredUsersList.rows && <RowsList rows={filteredUsersList.rows} />}
      </div>
      <div className="users-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
