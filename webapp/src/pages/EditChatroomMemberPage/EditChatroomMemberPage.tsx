import {
  AvatarPageTemplate,
  ButtonProps,
  ButtonVariant,
  IconVariant,
  Row,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import './EditChatroomMemberPage.css';
import { AVATAR_EP_URL, CHATROOM_URL, USER_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { ResponseError } from '../../shared/generated';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useAuth } from '../../shared/hooks/UseAuth';
import ToggleSwitchSet, { CanEdit } from './components/ToggleSwitchSet';
import Text from '../../shared/components/Text/Text';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';

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
  const { data: destUser, isLoading: isDestUserLoading } =
    useData(getUserByUserName);

  const useGetChatroomMember = (id?: string) =>
    useCallback(() => {
      if (!id) {
        return Promise.reject(new Error('The chatroom member could not load'));
      }
      return chatApi.chatControllerGetChatroomMember({
        chatroomId: chatroomId!,
        userId: id,
      });
    }, [id]);
  const { data: destCrMember, isLoading: isDestCrMemberLoading } = useData(
    useGetChatroomMember(destUser?.id),
  );

  const { authUser, isLoading: isAuthUserLoading } = useAuth();
  const { data: authCrMember, isLoading: isAuthCrMemberLoading } = useData(
    useGetChatroomMember(authUser?.id),
  );
  const { userStatus } = useUserStatus();
  const onlineStatus = userStatus(destCrMember?.userId);

  const [canEdit] = CanEdit({
    chatroom,
    destCrMember,
    destUser,
    authCrMember,
    authUserId: authUser?.id ?? null,
  });

  const removeChatMember = useCallback(async () => {
    try {
      if (!(destUser && chatroomId)) {
        return;
      }
      await chatApi.chatControllerRemoveChatroomMember({
        chatroomId: chatroomId,
        userId: destUser.id,
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

  const button: ButtonProps | undefined = canEdit
    ? {
        variant: ButtonVariant.WARNING,
        iconVariant: IconVariant.REMOVE,
        children: 'remove from chat',
        onClick: removeChatMember,
      }
    : undefined;
  const isLoading: boolean =
    isChatroomLoading ||
    isDestCrMemberLoading ||
    isDestUserLoading ||
    isAuthUserLoading ||
    isAuthCrMemberLoading;
  return (
    <div className="edit-chatroom-member-page">
      <AvatarPageTemplate
        isLoading={isLoading}
        headerStatusVariant={onlineStatus}
        title="chat user"
        avatarProps={{
          url: `${AVATAR_EP_URL}/${chatroom?.avatarId}`,
          XCoordinate: chatroom?.avatarX,
          YCoordinate: chatroom?.avatarY,
        }}
        captionLikeElement={
          <>
            <Text
              variant={TextVariant.PARAGRAPH}
              color={TextColor.LIGHT}
              weight={TextWeight.MEDIUM}
            >
              {chatroom?.name ?? ''}
            </Text>
            <Text
              variant={TextVariant.CAPTION}
              color={TextColor.LIGHT}
              weight={TextWeight.MEDIUM}
            >
              {chatroom?.isPublic ? 'public chatroom' : 'private chatroom'}
            </Text>
          </>
        }
        button={button}
        isNotFound={
          !(chatroom && destCrMember && destUser && authUser && authCrMember)
        }
      >
        <>
          <Row
            avatarProps={{
              url: `${AVATAR_EP_URL}/${destUser?.avatarId ?? ''}`,
              status: onlineStatus,
              XCoordinate: destUser?.avatarX ?? 0,
              YCoordinate: destUser?.avatarY ?? 0,
            }}
            iconVariant={IconVariant.USERS}
            url={`${USER_URL}/${username}`}
            title={username}
            subtitle="level x"
          />
          <ToggleSwitchSet
            isLoading={isLoading}
            chatroomId={chatroomId ?? ''}
            canEditParams={{
              chatroom,
              destCrMember,
              destUser,
              authUserId: authUser?.id ?? '',
              authCrMember,
            }}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
