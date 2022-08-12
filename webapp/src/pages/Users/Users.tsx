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
import { USER_URL, USERS_EP_URL, USERS_URL } from '../../shared/urls';
import { Link } from 'react-router-dom';

class User {
  username: string;
  email: string;
  avatarId: string | null;
  id: string;
  createdAt: Date;

  constructor(
    username: string,
    email: string,
    avatarId: string | null,
    id: string,
    createdAt: Date,
  ) {
    this.username = username;
    this.email = email;
    this.avatarId = avatarId;
    this.id = id;
    this.createdAt = createdAt;
  }
}

export default function Users() {
  const wildcardAvatar = 'https://i.pravatar.cc/9000';

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
            : wildcardAvatar,
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

  const [userList, setUserList] = useState<RowsListProps>({ rows: [] });

  useEffect(() => {
    const fetchUsersList = async () => {
      const lRows = await getRows(`${USERS_EP_URL}`);
      setUserList({ ...lRows });
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
        {userList.rows && <RowsList rows={userList.rows} />}
      </div>
      <div className="users-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
