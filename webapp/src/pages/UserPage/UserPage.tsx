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
import { AVATAR_EP_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';
import { useBlock } from '../../shared/hooks/UseBlock';
import { useOnlineUsers } from '../../shared/hooks/UseOnlineUsers';

export default function UserPage() {
  const { username } = useParams();
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading } = useData(getUserByUserName);
  const { blockRelation, unblockUser, blockUser } = useBlock(user);
  const { onlineUserIds } = useOnlineUsers();
  const onlineStatus =
    user && onlineUserIds.has(user?.id) ? 'online' : 'offline';
  return (
    <div className="user-page">
      <AvatarPageTemplate
        isLoading={isLoading}
        headerStatusVariant={onlineStatus}
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
        </>
      </AvatarPageTemplate>
    </div>
  );
}
