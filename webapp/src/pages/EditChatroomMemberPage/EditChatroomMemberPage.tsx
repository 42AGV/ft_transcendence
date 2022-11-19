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
  USER_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { ChatControllerUpdateChatroomMemberRequest } from '../../shared/generated/apis/ChatApi';

export default function EditChatroomMemberPage() {
  const { chatroomId, username } = useParams();

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
  const removeChatMember = useCallback(
    () =>
      chatApi.chatControllerRemoveChatroomMember({
        chatroomId: chatroomId!,
        userId: user?.id ?? '',
      }),
    [chatroomId, user],
  );
  const [updateChatroomMember, setUpdateChatroomMember] =
    useState<ChatControllerUpdateChatroomMemberRequest | null>(null);
  useEffect(() => {
    if (!chatroomId || !user || !crMember) return;
    setUpdateChatroomMember({
      chatroomId: chatroomId,
      userId: user.id,
      updateChatroomMemberDto: {
        admin: crMember.admin,
        muted: crMember.muted,
        banned: crMember.banned,
      },
    });
  }, [user, crMember, chatroomId]);
  return (
    <div className="edit-chatroom-member-page">
      <AvatarPageTemplate
        isLoading={isChatroomLoading && isCrMemberUserLoading && isUserLoading}
        headerStatusVariant="online"
        title="chatroom member"
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
            label="admin"
            isToggled={
              updateChatroomMember?.updateChatroomMemberDto.admin ?? false
            }
            onToggle={async () => {
              if (
                !updateChatroomMember?.chatroomId ||
                updateChatroomMember?.updateChatroomMemberDto.admin ===
                  undefined ||
                !user
              ) {
                return;
              }
              await chatApi.chatControllerUpdateChatroomMember({
                ...updateChatroomMember,
                updateChatroomMemberDto: {
                  admin: !updateChatroomMember.updateChatroomMemberDto.admin,
                },
              });
              setUpdateChatroomMember({
                ...updateChatroomMember,
                updateChatroomMemberDto: {
                  admin: !updateChatroomMember.updateChatroomMemberDto.admin,
                },
              });
            }}
          />
          <ToggleSwitch
            label="muted"
            isToggled={
              updateChatroomMember?.updateChatroomMemberDto.muted ?? false
            }
            onToggle={async () => {
              if (
                !updateChatroomMember?.chatroomId ||
                updateChatroomMember?.updateChatroomMemberDto.muted ===
                  undefined ||
                !user
              ) {
                return;
              }
              await chatApi.chatControllerUpdateChatroomMember({
                ...updateChatroomMember,
                updateChatroomMemberDto: {
                  muted: !updateChatroomMember.updateChatroomMemberDto.muted,
                },
              });
              setUpdateChatroomMember({
                ...updateChatroomMember,
                updateChatroomMemberDto: {
                  muted: !updateChatroomMember.updateChatroomMemberDto.muted,
                },
              });
            }}
          />
          <ToggleSwitch
            label="banned"
            isToggled={
              updateChatroomMember?.updateChatroomMemberDto.banned ?? false
            }
            onToggle={async () => {
              if (
                !updateChatroomMember?.chatroomId ||
                updateChatroomMember?.updateChatroomMemberDto.banned ===
                  undefined ||
                !user
              ) {
                return;
              }
              await chatApi.chatControllerUpdateChatroomMember({
                ...updateChatroomMember,
                updateChatroomMemberDto: {
                  banned: !updateChatroomMember.updateChatroomMemberDto.banned,
                },
              });
              setUpdateChatroomMember({
                ...updateChatroomMember,
                updateChatroomMemberDto: {
                  banned: !updateChatroomMember.updateChatroomMemberDto.banned,
                },
              });
            }}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
