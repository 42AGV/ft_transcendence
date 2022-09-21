import { IconVariant, RowItem } from '../../shared/components';
import {
  AVATAR_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import {
  instanceOfUser,
  User,
  UserControllerGetUsersRequest,
} from '../../shared/generated';
import { RowsTemplate } from '../../shared/components/index';
import { useCallback } from 'react';
import { usersApi } from '../../shared/services/ApiService';

/* TODO: implement this
const mapGameToRow = (game: Game): RowItem => {
  return {
  };
}; */
const mapUserToRow = (user: User): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: user.avatarId
        ? `${AVATAR_EP_URL}/${user.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
    },
    url: `${USERS_URL}/${user.id}`,
    title: user.username,
    subtitle: 'level x',
    key: user.id,
  };
};

export default function PlayPage() {
  const getUsers = useCallback(
    (requestParameters: UserControllerGetUsersRequest) =>
      usersApi.userControllerGetUsers(requestParameters),
    [],
  );
  return (
    <RowsTemplate
      dataValidator={instanceOfUser}
      fetchFn={getUsers}
      dataMapper={mapUserToRow}
    />
  );
}
