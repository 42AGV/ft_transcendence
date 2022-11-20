import {
  AvatarPageTemplate,
  ButtonProps,
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
import { ChatroomMember } from '../../shared/generated/models/ChatroomMember';
import { User } from '../../shared/generated/models/User';

import { useNavigation } from '../../shared/hooks/UseNavigation';
import { ResponseError } from '../../shared/generated';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useAuth } from '../../shared/hooks/UseAuth';

type CanEditParams = {
  chatroom: Chatroom | null;
  destCrMember: ChatroomMember | null;
  destUser: User | null;
  authCrMember: ChatroomMember | null;
};

function CanEdit({
  chatroom,
  destCrMember,
  destUser,
  authCrMember,
}: CanEditParams): boolean[] {
  const isAuthOwner = destUser?.id === chatroom?.ownerId ?? false;
  const isAuthAdmin = authCrMember?.admin ?? false;
  const isAuthBanned = authCrMember?.banned ?? true;
  const isDestOwner = chatroom?.ownerId === destUser?.id ?? true;
  const isDestAdmin = destCrMember?.admin ?? true;
  return [
    (isAuthOwner || (isAuthAdmin && !isAuthBanned && !isDestAdmin)) &&
      !isDestOwner,
    isAuthOwner,
  ];
}

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
  const { data: destUser, isLoading: isUserLoading } =
    useData(getUserByUserName);

  const useGetChatroomMember = (id?: string) =>
    useCallback(
      () =>
        chatApi.chatControllerGetChatroomMember({
          chatroomId: chatroomId!,
          userId: id ?? '',
        }),
      [id],
    );
  const { data: destCrMember, isLoading: isCrMemberUserLoading } = useData(
    useGetChatroomMember(destUser?.id),
  );

  const { authUser, isLoading: isAuthUserLoading } = useAuth();
  const { data: authCrMember, isLoading: isAuthCrMemberUserLoading } = useData(
    useGetChatroomMember(authUser?.id),
  );

  const [updateChatroomMemberDto, setUpdateChatroomMemberDto] =
    useState<UpdateChatroomMemberDto | null>(null);
  useEffect(() => {
    if (!destCrMember) return;
    setUpdateChatroomMemberDto({
      admin: destCrMember.admin,
      muted: destCrMember.muted,
      banned: destCrMember.banned,
    });
  }, [destCrMember]);

  const [canEdit, isAuthOwner] = CanEdit({
    chatroom,
    destCrMember,
    destUser,
    authCrMember,
  });

  const removeChatMember = useCallback(async () => {
    try {
      await chatApi.chatControllerRemoveChatroomMember({
        chatroomId: chatroomId!,
        userId: destUser?.id ?? '',
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
  }, [chatroomId, destUser, navigate, warn]);

  const genericOnToggle = (dto: UpdateChatroomMemberDto): (() => void) => {
    return async () => {
      if (!destUser || !chatroomId || !canEdit) {
        if (!canEdit) warn("You can't modify this setting");
        return;
      }
      try {
        if (!isAuthOwner && dto.admin !== undefined) {
          warn('You cannot make new admins');
          return;
        }
        const oldUpdateChatroomMember = updateChatroomMemberDto;
        await chatApi.chatControllerUpdateChatroomMember({
          chatroomId: chatroomId,
          userId: destUser.id,
          updateChatroomMemberDto: dto,
        });
        setUpdateChatroomMemberDto({ ...oldUpdateChatroomMember, ...dto });
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
          warn('Could not update the chat member');
        }
      }
    };
  };

  const button: ButtonProps | undefined = canEdit
    ? {
        variant: ButtonVariant.WARNING,
        iconVariant: IconVariant.REMOVE,
        children: 'remove from chat',
        onClick: removeChatMember,
      }
    : undefined;
  return (
    <div className="edit-chatroom-member-page">
      <AvatarPageTemplate
        isLoading={
          isChatroomLoading ||
          isCrMemberUserLoading ||
          isUserLoading ||
          isAuthUserLoading ||
          isAuthCrMemberUserLoading
        }
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
        button={button}
      >
        <>
          <Row
            avatarProps={{
              url: `${AVATAR_EP_URL}/${destUser?.avatarId ?? ''}`,
              status: 'offline',
              XCoordinate: destUser?.avatarX ?? 0,
              YCoordinate: destUser?.avatarY ?? 0,
            }}
            iconVariant={IconVariant.USERS}
            url={`${USER_URL}/${username}`}
            title={username}
            subtitle="level x"
          />
          <ToggleSwitch
            label="Admin"
            isToggled={updateChatroomMemberDto?.admin ?? false}
            onToggle={genericOnToggle({
              admin: !updateChatroomMemberDto?.admin,
            })}
          />
          <ToggleSwitch
            label="Muted"
            isToggled={updateChatroomMemberDto?.muted ?? false}
            onToggle={genericOnToggle({
              muted: !updateChatroomMemberDto?.muted,
            })}
          />
          <ToggleSwitch
            label="Banned"
            isToggled={updateChatroomMemberDto?.banned ?? false}
            onToggle={genericOnToggle({
              banned: !updateChatroomMemberDto?.banned,
            })}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
