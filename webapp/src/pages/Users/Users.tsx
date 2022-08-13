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
import React, { useEffect, useState } from 'react';
import {
  USER_URL,
  USERS_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Link } from 'react-router-dom';

interface User {
  readonly username: string;
  readonly email: string;
  readonly avatarId: string | null;
  readonly id: string;
  readonly createdAt: Date;
}

export default function Users() {
  const [usersList, setUsersList] = useState<RowsListProps>({ rows: [] });

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
        url: `${USERS_URL}/${user.username}`,
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
