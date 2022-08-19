import './Users.css';
import { IconVariant, RowItem } from '../../shared/components';
import {
  USER_URL,
  USERS_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { instanceOfArrayTyped } from '../../shared/types';
import { instanceOfUser, User } from '../../shared/generated';
import DispatchPage from '../../shared/components/DispatchPage/DispatchPage';

function instanceOfUserArray(value: object): boolean {
  return instanceOfArrayTyped(value, instanceOfUser);
}

const mapUserToRow = (user: User): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: user.avatarId
        ? `${USERS_EP_URL}/${user.id}/avatar`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
    },
    url: `${USERS_URL}/${user.id}`,
    title: user.username,
    subtitle: 'level x',
    key: user.id,
  };
};

export default function Users() {
  return (
    <DispatchPage
      dataValidator={instanceOfUserArray}
      genericEndpointUrl={USERS_EP_URL}
      dataMapper={mapUserToRow}
    />
  );
}
