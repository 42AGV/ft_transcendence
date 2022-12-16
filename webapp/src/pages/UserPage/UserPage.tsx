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
  Loading,
} from '../../shared/components';
import { AVATAR_EP_URL, CHAT_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';
import { useBlock } from '../../shared/hooks/UseBlock';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { useFriend } from '../../shared/hooks/UseFriend';
import { UserStatus } from '../../shared/context/UserStatusContext';

export default function UserPage() {
  const { username } = useParams();
  const { navigate } = useNavigation();
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading } = useData(getUserByUserName);
  const { blockRelation, unblockUser, blockUser } = useBlock(user);
  const { userStatus } = useUserStatus();
  const [isToggled, setIsToggled] = useState(false);
  const { userFriends } = useFriend();
  const [status, setStatus] = useState<UserStatus>();

  useEffect(() => {
    if (user && user.isFriend) {
      setIsToggled(true);
    }
  }, [user, user?.isFriend]);
  const onToggle = async () => {
    setIsToggled(!isToggled);
    if (user) {
      try {
        if (!isToggled) {
          await usersApi.userControllerFollowUser({ userId: user.id });
        } else {
          usersApi.userControllerUnfollowUser({ userId: user.id });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (user) {
      setStatus(userFriends(user.id) ? userStatus(user?.id) : undefined);
    }
  }, [isToggled]);
  if (!user) {
    return (
      <div className="user-page-loading">
        <Loading />
      </div>
    );
  }
  return (
    <div className="user-page">
      <AvatarPageTemplate
        isLoading={isLoading}
        headerStatusVariant={status}
        isNotFound={user === null}
        title={user?.username ?? ''}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${user?.avatarId ?? ''}`,
          caption: 'level 4',
          XCoordinate: user?.avatarX ?? 0,
          YCoordinate: user?.avatarY ?? 0,
        }}
        button={
          (blockRelation && {
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
          {blockRelation && (
            <ToggleSwitch
              label={blockRelation.isUserBlocked ? 'Unblock' : 'Block'}
              isToggled={blockRelation.isUserBlocked ?? false}
              onToggle={blockRelation.isUserBlocked ? unblockUser : blockUser}
            />
          )}
          <ToggleSwitch
            label={isToggled ? 'Unfollow' : 'Follow'}
            isToggled={isToggled}
            onToggle={onToggle}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
