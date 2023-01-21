import { ToggleSwitch } from '../../../shared/components';
import { UpdateChatroomMemberDto } from '../../../shared/generated/models/UpdateChatroomMemberDto';
import React, { useEffect, useState } from 'react';
import { chatApi } from '../../../shared/services/ApiService';
import { useNotificationContext } from '../../../shared/context/NotificationContext';
import { ChatroomMember } from '../../../shared/generated/models/ChatroomMember';
import { Chatroom } from '../../../shared/generated/models/Chatroom';
import { User } from '../../../shared/generated/models/User';
import { handleRequestError } from '../../../shared/utils/HandleRequestError';

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
    const { admin, muted, banned } = canEditParams.destCrMember;
    setUpdateChatroomMemberDto({
      admin,
      muted,
      banned,
    });
  }, [canEditParams.destCrMember]);
  const { notify, warn } = useNotificationContext();

  const [canEdit, isAuthOwner, isGlobalAdmin] = CanEdit(canEditParams);

  const genericOnToggle = (
    key: keyof UpdateChatroomMemberDto,
  ): (() => void) => {
    return async () => {
      if (isLoading || !canEdit) {
        if (!canEdit) warn("You can't modify this setting");
        return;
      }
      try {
        if (!isAuthOwner && key === 'admin' && !isGlobalAdmin) {
          warn('You cannot make new admins');
          return;
        }
        const newValue = !updateChatroomMemberDto?.[key] ?? false;
        await chatApi.chatControllerUpdateChatroomMember({
          chatroomId: chatroomId,
          userId: canEditParams.destUser!.id,
          updateChatroomMemberDto: { [key]: newValue },
        });
        setUpdateChatroomMemberDto({
          ...updateChatroomMemberDto,
          [key]: newValue,
        });
        const { username } = canEditParams.destUser!;
        try {
          notify(
            newValue
              ? `Added ${key} role to ${username}`
              : `Removed ${key} role from ${username}`,
          );
        } catch {
          notify(`${username} chatroom member successfully updated`);
        }
      } catch (error: unknown) {
        handleRequestError(error, 'Could not update the chat member', warn);
      }
    };
  };
  const keysOfUpdateChatroomMemberDto: (keyof UpdateChatroomMemberDto)[] = [
    'admin',
    'muted',
    'banned',
  ];
  return (
    <>
      {keysOfUpdateChatroomMemberDto.map(
        (key: keyof UpdateChatroomMemberDto) => {
          return (
            <ToggleSwitch
              label={key}
              isToggled={updateChatroomMemberDto?.[key] ?? false}
              onToggle={genericOnToggle(key)}
            />
          );
        },
      )}
    </>
  );
}
