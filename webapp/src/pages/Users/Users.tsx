import './Users.css';
import {
  IconVariant,
  NavigationBar,
  RowsList,
  RowsListProps,
  SearchForm,
  SmallAvatar,
} from '../../shared/components';
import { useEffect, useState } from 'react';
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
    const users = (await fetch(url).then((response) => response.json())) ?? [];
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
  useEffect(() => {}, [usersList]);

  return (
    <div className="users">
      <div className="users-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="users-search">
        <SearchForm
          url={`${USERS_EP_URL}`}
          setChange={setUsersList}
          getValues={getRows}
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
