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
import { SearchContextProvider } from '../../shared/context/SearchContext';

const ENTRIES_LIMIT = 15;

const mapUserToRow = (user: User): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: user.avatarId
        ? `${AVATAR_EP_URL}/${user.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
      XCoordinate: user.avatarX,
      YCoordinate: user.avatarY,
    },
    url: `${USERS_URL}/${user.id}`,
    title: user.username,
    subtitle: 'level x',
    key: user.id,
  };
};

export default function UsersPage() {
  const getUsers = useCallback(
    (requestParameters: UserControllerGetUsersRequest) =>
      usersApi.userControllerGetUsers({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );

  return (
    <SearchContextProvider fetchFn={getUsers} maxEntries={ENTRIES_LIMIT}>
      <RowsTemplate dataMapper={mapUserToRow} dataValidator={instanceOfUser} />
    </SearchContextProvider>
  );
}
