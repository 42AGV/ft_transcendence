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
import {
  ADMIN_URL,
  AVATAR_EP_URL,
  CHATROOM_URL,
  USER_URL,
} from '../../shared/urls';
import { useLocation, useParams } from 'react-router-dom';
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
import { useGetChatroomMember } from '../../shared/hooks/UseGetChatroomMember';

export default function EditChatroomMemberPage() {
  const { chatroomId, username } = useParams();
  const { warn } = useNotificationContext();
  const { navigate } = useNavigation();
  const { pathname } = useLocation();
  const { authUser, isLoading: isAuthUserLoading } = useAuth();
  const overridePermissions = pathname.slice(0, ADMIN_URL.length) === ADMIN_URL;

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

  const { data: destCrMember, isLoading: isDestCrMemberLoading } = useData(
    useGetChatroomMember(chatroomId!, destUser?.id),
    useCallback(() => {}, []),
  );

  const { data: authCrMember, isLoading: isAuthCrMemberLoading } = useData(
    useGetChatroomMember(chatroomId!, authUser?.id),
    useCallback(() => {}, []),
  );
  const { userStatus } = useUserStatus();
  const chatroomMemberStatus = userStatus(destCrMember?.userId);

  const [canEdit] = CanEdit({
    chatroom,
    destCrMember,
    destUser,
    authCrMember,
    authUserId: authUser?.id ?? null,
    isGlobalAdmin: overridePermissions,
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
      navigate(
        `${
          overridePermissions ? ADMIN_URL : ''
        }${CHATROOM_URL}/${chatroomId}/details`,
        { replace: true },
      );
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
        headerStatusVariant={chatroomMemberStatus}
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
          !(
            chatroom &&
            destCrMember &&
            destUser &&
            authUser &&
            (authCrMember || overridePermissions)
          )
        }
      >
        <>
          <Row
            avatarProps={{
              url: `${AVATAR_EP_URL}/${destUser?.avatarId ?? ''}`,
              status: chatroomMemberStatus,
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
              isGlobalAdmin: overridePermissions,
            }}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
