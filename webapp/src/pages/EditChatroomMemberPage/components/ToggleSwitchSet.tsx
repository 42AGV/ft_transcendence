import { ToggleSwitch } from '../../../shared/components';
import { UpdateChatroomMemberDto } from '../../../shared/generated/models/UpdateChatroomMemberDto';
import React, { useEffect, useState } from 'react';
import { chatApi } from '../../../shared/services/ApiService';
import { useNotificationContext } from '../../../shared/context/NotificationContext';
import { ChatroomMember } from '../../../shared/generated/models/ChatroomMember';
import { Chatroom } from '../../../shared/generated/models/Chatroom';
import { User } from '../../../shared/generated/models/User';
import { handleRequestError } from '../../../shared/utils';

type CanEditParams = {
  chatroom: Chatroom | null;
  destCrMember: ChatroomMember | null;
  destUser: User | null;
  authCrMember: ChatroomMember | null;
  authUserId: string | null;
  isGlobalAdmin: boolean;
};

type ToggleSwitchSetProps = {
  isLoading: boolean;
  chatroomId: string;
  canEditParams: CanEditParams;
};

export function CanEdit({
  chatroom,
  destCrMember,
  destUser,
  authCrMember,
  authUserId,
  isGlobalAdmin,
}: CanEditParams): boolean[] {
  if (!(chatroom && destCrMember && destUser && authUserId))
    return [false, false, false];
  if (!authCrMember) {
    if (isGlobalAdmin) return [true, true, true];
    return [false, false, false];
  }
  const isAuthOwner = authUserId === chatroom.ownerId;
  const isDestOwner = chatroom.ownerId === destUser.id;
  return [
    ((isAuthOwner ||
      (authCrMember.admin && !authCrMember.banned && !destCrMember.admin)) &&
      !isDestOwner) ||
      isGlobalAdmin,
    isAuthOwner,
    isGlobalAdmin,
  ];
}

export default function ToggleSwitchSet({
  canEditParams,
  isLoading,
  chatroomId,
}: ToggleSwitchSetProps) {
  const [updateChatroomMemberDto, setUpdateChatroomMemberDto] =
    useState<UpdateChatroomMemberDto | null>(null);
  useEffect(() => {
    if (!canEditParams.destCrMember) return;
    setUpdateChatroomMemberDto({
      admin: canEditParams.destCrMember.admin,
      muted: canEditParams.destCrMember.muted,
      banned: canEditParams.destCrMember.banned,
    });
  }, [canEditParams.destCrMember]);
  const { warn } = useNotificationContext();

  const [canEdit, isAuthOwner, isGlobalAdmin] = CanEdit(canEditParams);

  const genericOnToggle = (dto: UpdateChatroomMemberDto): (() => void) => {
    return async () => {
      if (isLoading || !canEdit) {
        if (!canEdit) warn("You can't modify this setting");
        return;
      }
      try {
        if (!isAuthOwner && dto.admin !== undefined && !isGlobalAdmin) {
          warn('You cannot make new admins');
          return;
        }
        const oldUpdateChatroomMember = updateChatroomMemberDto;
        await chatApi.chatControllerUpdateChatroomMember({
          chatroomId: chatroomId,
          userId: canEditParams.destUser!.id,
          updateChatroomMemberDto: dto,
        });
        setUpdateChatroomMemberDto({ ...oldUpdateChatroomMember, ...dto });
      } catch (error: unknown) {
        handleRequestError(error, 'Could not update the chat member', warn);
      }
    };
  };
  return (
    <>
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
  );
}
