import { IconVariant, RowItem } from '../../shared/components';
import { AVATAR_EP_URL, USER_URL } from '../../shared/urls';
import { User, UserControllerGetUsersRequest } from '../../shared/generated';
import { MainTabTemplate } from '../../shared/components/index';
import { useCallback } from 'react';
import { usersApi } from '../../shared/services/ApiService';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useOnlineUsers } from '../../shared/hooks/UseOnlineUsers';

export default function UsersPage() {
  const { onlineUserIds } = useOnlineUsers();
  const getUsers = useCallback(
    (requestParameters: UserControllerGetUsersRequest) =>
      usersApi.userControllerGetUsers({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );

  const mapUserToRow = (user: User): RowItem => {
    const onlineStatus = onlineUserIds.has(user.id) ? 'online' : 'offline';
    return {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${user.avatarId}`,
        status: onlineStatus,
        XCoordinate: user.avatarX,
        YCoordinate: user.avatarY,
      },
      url: `${USER_URL}/${user.username}`,
      title: user.username,
      subtitle: 'level x',
      key: user.id,
    };
  };

  return (
    <SearchContextProvider fetchFn={getUsers} maxEntries={ENTRIES_LIMIT}>
      <MainTabTemplate dataMapper={mapUserToRow} />
    </SearchContextProvider>
  );
}
