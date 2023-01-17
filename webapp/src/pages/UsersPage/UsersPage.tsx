import {
  ButtonProps,
  ButtonVariant,
  IconVariant,
  RowItem,
} from '../../shared/components';
import {
  ADMIN_URL,
  AVATAR_EP_URL,
  CHATS_URL,
  FRIENDS_URL,
  USER_URL,
} from '../../shared/urls';
import { User, UserControllerGetUsersRequest } from '../../shared/generated';
import { MainTabTemplate } from '../../shared/components/index';
import { useCallback } from 'react';
import { usersApi } from '../../shared/services/ApiService';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFriend } from '../../shared/hooks/UseFriend';

export default function UsersPage() {
  const { userStatus } = useUserStatus();
  const { userFriends } = useFriend();
  const { pathname } = useLocation();
  const overridePermissions = pathname.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const navigate = useNavigate();
  const getUsers = useCallback(
    (requestParameters: UserControllerGetUsersRequest) =>
      usersApi.userControllerGetUsers({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );

  let friendsButton: ButtonProps[];

  if (!overridePermissions) {
    friendsButton = [
      {
        variant: ButtonVariant.SUBMIT,
        iconVariant: IconVariant.ARROW_BACK,
        onClick: () => navigate(FRIENDS_URL),
        children: 'Friends',
      },
    ];
  } else {
    friendsButton = [
      {
        variant: ButtonVariant.SUBMIT,
        iconVariant: IconVariant.ARROW_FORWARD,
        onClick: () => navigate(`${ADMIN_URL}${CHATS_URL}`),
        children: 'Admin chats',
      },
    ];
  }

  const mapUserToRow = (user: User): RowItem => {
    return {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${user.avatarId}`,
        status: userFriends(user.id) ? userStatus(user?.id) : undefined,
        XCoordinate: user.avatarX,
        YCoordinate: user.avatarY,
      },
      url: `${overridePermissions ? ADMIN_URL : ''}${USER_URL}/${
        user.username
      }`,
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
