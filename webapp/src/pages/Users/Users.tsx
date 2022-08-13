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

interface User {
  readonly username: string;
  readonly email: string;
  readonly avatarId: string | null;
  readonly id: string;
  readonly createdAt: Date;
}

export default function Users() {
  const GetRows = (url: string): RowsListProps => {
    const users = useData(url);
    if (!users) {
      return { rows: [] };
    }
    return {
      // @ts-ignore
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
        <RowsList rows={GetRows(`${USERS_EP_URL}`).rows} />
      </div>
      <div className="users-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
