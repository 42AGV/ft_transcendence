import { ToggleSwitch } from '../../../shared/components';
import { UpdateChatroomMemberDto } from '../../../shared/generated/models/UpdateChatroomMemberDto';
import { ResponseError } from '../../../shared/generated';
import React from 'react';
import { chatApi } from '../../../shared/services/ApiService';
import { useNotificationContext } from '../../../shared/context/NotificationContext';
import { ChatroomMember } from '../../../shared/generated/models/ChatroomMember';
import { Chatroom } from '../../../shared/generated/models/Chatroom';
import { User } from '../../../shared/generated/models/User';

type CanEditParams = {
  chatroom: Chatroom | null;
  destCrMember: ChatroomMember | null;
  destUser: User | null;
  authCrMember: ChatroomMember | null;
};

export type ToggleSwitchSetProps = {
  updateChatroomMemberDto: UpdateChatroomMemberDto | null;
  setUpdateChatroomMemberDto: React.Dispatch<
    React.SetStateAction<UpdateChatroomMemberDto | null>
  >;
  isLoading: boolean;
  chatroomId: string;
  canEditParams: CanEditParams;
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

export default function ToggleSwitchSet({
  updateChatroomMemberDto,
  setUpdateChatroomMemberDto,
  canEditParams,
  isLoading,
  chatroomId,
}: ToggleSwitchSetProps) {
  const { warn } = useNotificationContext();

  const [canEdit, isAuthOwner] = CanEdit(canEditParams);

  const genericOnToggle = (dto: UpdateChatroomMemberDto): (() => void) => {
    return async () => {
      if (isLoading || !canEdit) {
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
          userId: canEditParams.destUser!.id,
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
