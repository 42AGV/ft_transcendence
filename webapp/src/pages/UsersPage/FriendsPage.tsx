import { ButtonVariant, IconVariant, RowItem } from '../../shared/components';
import { AVATAR_EP_URL, USERS_URL, USER_URL } from '../../shared/urls';
import { User, UserControllerGetFriendsRequest } from '../../shared/generated';
import { MainTabTemplate } from '../../shared/components/index';
import { useCallback } from 'react';
import { usersApi } from '../../shared/services/ApiService';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';
import { useNavigate } from 'react-router-dom';

export default function FriendsPage() {
  const { userStatus } = useUserStatus();
  const navigate = useNavigate();
  const getFriends = useCallback(
    (requestParameters: UserControllerGetFriendsRequest) =>
      usersApi.userControllerGetFriends({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );
  const usersButton = [
    {
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.ARROW_FORWARD,
      onClick: () => navigate(USERS_URL),
      children: 'Find new friends',
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
    <SearchContextProvider fetchFn={getFriends} maxEntries={ENTRIES_LIMIT}>
      <MainTabTemplate dataMapper={mapUserToRow} buttons={usersButton} />
    </SearchContextProvider>
  );
}
