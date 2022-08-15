import './Users.css';
import {
  IconVariant,
  NavigationBar,
  RowItem,
  RowsList,
  SearchForm,
  SmallAvatar,
} from '../../shared/components';
import { useState } from 'react';
import {
  USER_URL,
  USERS_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Link } from 'react-router-dom';
import { instanceOfArrayTyped, instanceOfUser, User } from '../../shared/types';

function instanceOfUserArray(value: object): boolean {
  return instanceOfArrayTyped(value, instanceOfUser);
}

const mapUsersToRows = (users: User[]): RowItem[] => {
  return users.map((user) => {
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
  });
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="users">
      <div className="users-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="users-search">
        <SearchForm url={`${USERS_EP_URL}?search=`} setChange={setUsers} />
      </div>
      <div className="users-rows">
        <RowsList rows={mapUsersToRows(users)} />
      </div>
      <div className="users-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
