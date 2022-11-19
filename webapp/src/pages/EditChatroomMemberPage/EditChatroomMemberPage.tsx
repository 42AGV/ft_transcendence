import {
  AvatarPageTemplate,
  ButtonVariant,
  IconVariant,
  Row,
  ToggleSwitch,
} from '../../shared/components';
import './EditChatroomMemberPage.css';
import {
  AVATAR_EP_URL,
  CHATROOM_EP_URL,
  CHATROOM_URL,
  USER_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { UpdateChatroomMemberDto } from '../../shared/generated/models/UpdateChatroomMemberDto';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { ResponseError } from '../../shared/generated';
import { useNotificationContext } from '../../shared/context/NotificationContext';

export default function EditChatroomMemberPage() {
  const { chatroomId, username } = useParams();
  const { warn } = useNotificationContext();
  const { navigate } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom, isLoading: isChatroomLoading } =
    useData<Chatroom>(getChatroom);
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(getUserByUserName);
  const getChatroomMember = useCallback(
    () =>
      chatApi.chatControllerGetChatroomMember({
        chatroomId: chatroomId!,
        userId: user?.id ?? '',
      }),
    [user, chatroomId],
  );
  const { data: crMember, isLoading: isCrMemberUserLoading } =
    useData(getChatroomMember);
  const removeChatMember = useCallback(async () => {
    try {
      await chatApi.chatControllerRemoveChatroomMember({
        chatroomId: chatroomId!,
        userId: user?.id ?? '',
      });
      navigate(`${CHATROOM_URL}/${chatroomId}/details`);
    } catch (error: unknown) {
      if (error instanceof ResponseError) {
        const responseBody = await error.response.json();
        if (responseBody.message) {
          warn(responseBody.message);
        } else {
          warn(error.response.statusText);
        }
      } else if (error instanceof Error) {
        warn(error.message);
      } else {
        warn('Could not remove the chat member');
      }
    }
  }, [chatroomId, user]);
  const [updateChatroomMember, setUpdateChatroomMember] =
    useState<UpdateChatroomMemberDto | null>(null);
  useEffect(() => {
    if (!crMember) return;
    setUpdateChatroomMember({
      admin: crMember.admin,
      muted: crMember.muted,
      banned: crMember.banned,
    });
  }, [crMember, chatroomId]);
  const genericOnToggle = (dto?: UpdateChatroomMemberDto): (() => void) => {
    return async () => {
      if (dto === undefined || !user || !chatroomId) {
        return;
      }
      await chatApi.chatControllerUpdateChatroomMember({
        chatroomId: chatroomId,
        userId: user.id,
        updateChatroomMemberDto: dto,
      });
      setUpdateChatroomMember(dto);
    };
  };
  return (
    <div className="edit-chatroom-member-page">
      <AvatarPageTemplate
        isLoading={isChatroomLoading && isCrMemberUserLoading && isUserLoading}
        headerStatusVariant="online"
        title="chat user"
        avatarProps={{
          url:
            // TODO: Remove the wildcard avatar when we implement #317
            chatroom?.avatarId
              ? `${CHATROOM_EP_URL}/${chatroomId}/avatars/${chatroom?.avatarId}`
              : WILDCARD_AVATAR_URL,
          XCoordinate: chatroom?.avatarX,
          YCoordinate: chatroom?.avatarY,
          caption: chatroom?.name ?? '',
        }}
        button={{
          variant: ButtonVariant.WARNING,
          iconVariant: IconVariant.REMOVE,
          children: 'remove from chat',
          onClick: removeChatMember,
        }}
      >
        <>
          <Row
            avatarProps={{
              url: `${AVATAR_EP_URL}/${user?.avatarId ?? ''}`,
              status: 'offline',
              XCoordinate: user?.avatarX ?? 0,
              YCoordinate: user?.avatarY ?? 0,
            }}
            iconVariant={IconVariant.USERS}
            url={`${USER_URL}/${username}`}
            title={username}
            subtitle="level x"
          />
          <ToggleSwitch
            label="Admin"
            isToggled={updateChatroomMember?.admin ?? false}
            onToggle={genericOnToggle({
              ...updateChatroomMember,
              admin: !updateChatroomMember?.admin,
            })}
          />
          <ToggleSwitch
            label="Muted"
            isToggled={updateChatroomMember?.muted ?? false}
            onToggle={genericOnToggle({
              ...updateChatroomMember,
              muted: !updateChatroomMember?.muted,
            })}
          />
          <ToggleSwitch
            label="Banned"
            isToggled={updateChatroomMember?.banned ?? false}
            onToggle={genericOnToggle({
              ...updateChatroomMember,
              banned: !updateChatroomMember?.banned,
            })}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
