import { ButtonVariant, IconVariant, RowItem } from '../../shared/components';
import { AVATAR_EP_URL, FRIENDS_URL, USER_URL } from '../../shared/urls';
import { User, UserControllerGetUsersRequest } from '../../shared/generated';
import { MainTabTemplate } from '../../shared/components/index';
import { useCallback } from 'react';
import { usersApi } from '../../shared/services/ApiService';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const { userStatus } = useUserStatus();
  const navigate = useNavigate();
  const getUsers = useCallback(
    (requestParameters: UserControllerGetUsersRequest) =>
      usersApi.userControllerGetUsers({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );

  const friendsButton = [
    {
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.ARROW_FORWARD,
      onClick: () => navigate(FRIENDS_URL),
      children: 'Friends',
    },
  ];

  const mapUserToRow = (user: User): RowItem => {
    return {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${user.avatarId}`,
        status: userStatus(user.id),
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
      <MainTabTemplate dataMapper={mapUserToRow} buttons={friendsButton} />
    </SearchContextProvider>
  );
}
