import './User.css';
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

export default function User() {
  const [userList, setUserList] = useState<RowsListProps>({ rows: [] });

  const getRows = async (url: string): Promise<RowsListProps> => {
    const user = (await fetch(url).then((response) => response.json())) ?? [];
    return {
      rows: user.map((user: User) => {
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

  useEffect(() => {
    const fetchUserList = async () => {
      const lUserList = await getRows(`${USERS_EP_URL}`);
      setUserList({ ...lUserList });
      return lUserList;
    };
    fetchUserList().catch((e) => console.error(e));
  }, []);

  return (
    <div className="user">
      <div className="user-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="user-search">
        <Input
          iconVariant={IconVariant.SEARCH}
          variant={InputVariant.DARK}
          placeholder="search"
        />
      </div>
      <div className="user-rows">
        {userList.rows && <RowsList rows={userList.rows} />}
      </div>
      <div className="user-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
