import './UserPage.css';
import {
  IconVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
  ToggleSwitch,
  ButtonVariant,
  AvatarPageTemplate,
} from '../../shared/components';
import { ADMIN_URL, AVATAR_EP_URL, CHAT_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { authApi, usersApi } from '../../shared/services/ApiService';
import { useBlock } from '../../shared/hooks/UseBlock';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { useFriend } from '../../shared/hooks/UseFriend';
import {
  UserToRoleDtoRoleEnum,
  UserWithAuthorizationResponseDto,
} from '../../shared/generated';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import socket from '../../shared/socket';
import { WsException } from '../../shared/types';
import { handleRequestError } from '../../shared/hooks/HandleRequestError';

export default function UserPage() {
  const { warn } = useNotificationContext();
  const { username } = useParams();
  const { navigate } = useNavigation();
  const { pathname } = useLocation();
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading } = useData(getUserByUserName);
  const overridePermissions = pathname.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const { blockRelation, unblockUser, blockUser } = useBlock(user);
  const { userStatus } = useUserStatus();
  const [isToggled, setIsToggled] = useState(false);
  const [userWithAuth, setUserWithAuth] =
    useState<UserWithAuthorizationResponseDto | null>(null);
  useEffect(() => {
    const getUser = async () => {
      setUserWithAuth(
        await authApi.authControllerRetrieveUserWithRoles({
          username: username!,
        }),
      );
    };
    if (overridePermissions) {
      getUser().catch((error: unknown) => {
        handleRequestError(error, 'Could not update authorization', warn);
      });
    }
  }, [warn, overridePermissions, username]);
  const { userFriends } = useFriend();

  useEffect(() => {
    if (user && user.isFriend !== null) {
      setIsToggled(user.isFriend);
    }
  }, [user]);

  const onToggle = async () => {
    setIsToggled(!isToggled);
    if (user) {
      try {
        if (!isToggled) {
          await usersApi.userControllerFollowUser({ userId: user.id });
        } else {
          await usersApi.userControllerUnfollowUser({ userId: user.id });
        }
      } catch (error) {
        handleRequestError(error, 'Could not toggle friends', warn);
      }
    }
  };

  const onToggleAuthorization =
    (label: keyof UserWithAuthorizationResponseDto) => async () => {
      const getRole = (label: keyof UserWithAuthorizationResponseDto) => {
        switch (label) {
          case 'gAdmin': {
            return UserToRoleDtoRoleEnum.Moderator;
          }
          case 'gBanned': {
            return UserToRoleDtoRoleEnum.Banned;
          }
          default: {
            warn('Trying to change unexpected authorization field');
          }
        }
      };
      if (userWithAuth) {
        if (!userWithAuth.gOwner) {
          setUserWithAuth({
            ...userWithAuth,
            [label]: !userWithAuth[label],
          });
          socket.emit('toggleUserWithRoles', {
            id: userWithAuth.id,
            role: getRole(label),
          });
        } else {
          warn('Cannot assign or remove roles from owner');
        }
      }
    };
  useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      warn(wsError.message);
    });

    return () => {
      socket.off('exception');
    };
  }, [warn]);

  return (
    <div className="user-page">
      <AvatarPageTemplate
        isLoading={isLoading}
        headerStatusVariant={
          user && userFriends(user.id) ? userStatus(user.id) : undefined
        }
        isNotFound={user === null}
        title={user?.username ?? ''}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${user?.avatarId ?? ''}`,
          caption: 'level 4',
          XCoordinate: user?.avatarX ?? 0,
          YCoordinate: user?.avatarY ?? 0,
        }}
        button={
          (!overridePermissions &&
            blockRelation && {
              disabled:
                (blockRelation.amIBlocked || blockRelation.isUserBlocked) ??
                false,
              variant: ButtonVariant.SUBMIT,
              iconVariant: IconVariant.SEND,
              children: 'Send message',
              onClick: () => navigate(`${CHAT_URL}/${user?.username}`),
            }) ||
          undefined
        }
      >
        <>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {user?.fullName ?? ''}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {user?.email ?? ''}
          </Text>
          {!overridePermissions && blockRelation && (
            <ToggleSwitch
              label={blockRelation.isUserBlocked ? 'Unblock' : 'Block'}
              isToggled={blockRelation.isUserBlocked ?? false}
              onToggle={blockRelation.isUserBlocked ? unblockUser : blockUser}
            />
          )}
          {!overridePermissions && user && user.isFriend !== null && (
            <ToggleSwitch
              label={isToggled ? 'Unfollow' : 'Follow'}
              isToggled={isToggled}
              onToggle={onToggle}
            />
          )}
          {userWithAuth && (
            <>
              <ToggleSwitch
                label={
                  userWithAuth.gAdmin
                    ? 'Remove global admin'
                    : 'Add global admin'
                }
                isToggled={userWithAuth.gAdmin}
                onToggle={onToggleAuthorization('gAdmin')}
              />
              <ToggleSwitch
                label={
                  userWithAuth.gBanned ? 'Remove global ban' : 'Add global ban'
                }
                isToggled={userWithAuth.gBanned}
                onToggle={onToggleAuthorization('gBanned')}
              />
            </>
          )}
        </>
      </AvatarPageTemplate>
    </div>
  );
}
