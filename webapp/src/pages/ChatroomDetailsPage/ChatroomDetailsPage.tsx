import {
  ButtonSize,
  ButtonVariant,
  Header,
  IconVariant,
  MediumAvatar,
  RowItem,
  RowsListTemplate,
  TextColor,
  TextVariant,
  TextWeight,
  Text,
  ButtonProps,
} from '../../shared/components';
import {
  AVATAR_EP_URL,
  CHATS_URL,
  CHATROOM_URL,
  ADMIN_URL,
} from '../../shared/urls';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import React, { useCallback } from 'react';
import './ChatroomDetailsPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { ChatroomMemberWithUser } from '../../shared/generated/models/ChatroomMemberWithUser';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { ChatControllerGetChatroomMembersRequest } from '../../shared/generated/apis/ChatApi';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { Query } from '../../shared/types';
import { useUserStatus } from '../../shared/hooks/UseUserStatus';
import { useGetChatroomMember } from '../../shared/hooks/UseGetChatroomMember';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { handleRequestError } from '../../shared/utils/HandleRequestError';
import { LoadingPage } from '..';

export default function ChatroomDetailsPage() {
  const { authUser, isLoading } = useAuth();
  const { warn, notify } = useNotificationContext();
  const { chatroomId } = useParams();
  const { pathname } = useLocation();
  const overridePermissions = pathname.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const { goBack, navigate } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom, isLoading: crIsLoading } =
    useData<Chatroom>(getChatroom);
  const isOwner: boolean = authUser?.id === chatroom?.ownerId;
  const { userStatus } = useUserStatus();
  const { data: crm, isLoading: isCrmLoading } = useGetChatroomMember(
    chatroomId!,
    authUser?.id,
  );
  const mapChatMemberToRow = (member: ChatroomMemberWithUser): RowItem => {
    const memberDetails = () => {
      if (member.owner) {
        return 'owner';
      }
      if (member.banned) {
        return 'banned';
      }
      if (member.admin) {
        return 'admin';
      }
      if (member.muted) {
        return 'muted';
      }
      return '';
    };
    return {
      iconVariant: IconVariant.EDIT,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${member.avatarId}`,
        status: userStatus(member.userId),
        XCoordinate: member.avatarX,
        YCoordinate: member.avatarY,
      },
      url: `${
        overridePermissions ? ADMIN_URL : ''
      }${CHATROOM_URL}/${chatroomId}/member/${member.username}/edit`,
      title: member.username,
      subtitle: memberDetails(),
      key: member.userId,
    };
  };
  const leaveChatroom = useCallback(async () => {
    if (!chatroomId) return;
    try {
      await chatApi.chatControllerLeaveChatroom({ chatroomId: chatroomId });
      navigate(`${CHATS_URL}`, { replace: true });
      notify('Succesfully left chatroom');
    } catch (error: unknown) {
      handleRequestError(error, 'Could not leave the chatroom', warn);
    }
  }, [warn, chatroomId, navigate]);

  const editChatroom = useCallback(async () => {
    if (!chatroomId) return;
    navigate(
      `${
        overridePermissions ? ADMIN_URL : ''
      }${CHATROOM_URL}/${chatroomId}/edit`,
    );
  }, [overridePermissions, chatroomId, navigate]);

  const getChatroomMembers = useCallback(
    <T extends Query>(requestParameters: T) =>
      chatApi.chatControllerGetChatroomMembers({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
        chatroomId: chatroomId!,
      } as ChatControllerGetChatroomMembersRequest),
    [chatroomId],
  );

  let button: ButtonProps;

  if (isOwner || overridePermissions) {
    button = {
      buttonSize: ButtonSize.SMALL,
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.EDIT,
      onClick: editChatroom,
    };
  } else {
    button = {
      buttonSize: ButtonSize.SMALL,
      variant: ButtonVariant.WARNING,
      iconVariant: IconVariant.LOGOUT,
      onClick: leaveChatroom,
    };
  }
  if (isLoading || isCrmLoading || crIsLoading) {
    return <LoadingPage />;
  }
  if ((!crm && !overridePermissions) || !chatroom) {
    return <NotFoundPage />;
  }
  return (
    <div className="chatroom-details-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="button"
        buttonProps={button}
      >
        chat details
      </Header>
      <div className="chatroom-briefing">
        <Link
          to={`${
            overridePermissions ? ADMIN_URL : ''
          }${CHATROOM_URL}/${chatroomId}`}
        >
          <MediumAvatar
            url={`${AVATAR_EP_URL}/${chatroom.avatarId}`}
            XCoordinate={chatroom.avatarX}
            YCoordinate={chatroom.avatarY}
          />
        </Link>
        <div className="chatroom-text-info">
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {chatroom.name.length > 15
              ? `${chatroom.name.substring(0, 15)}...`
              : chatroom.name}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {chatroom.isPublic ? 'public chatroom' : 'private chatroom'}
          </Text>
        </div>
      </div>
      <SearchContextProvider
        fetchFn={getChatroomMembers}
        maxEntries={ENTRIES_LIMIT}
      >
        <RowsListTemplate dataMapper={mapChatMemberToRow} />
      </SearchContextProvider>
    </div>
  );
}
