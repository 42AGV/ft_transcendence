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
import { AVATAR_EP_URL, CHAT_URL, CHATROOM_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import React, { useCallback } from 'react';
import './ChatroomDetailsPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { ResponseError } from '../../shared/generated';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { ChatroomMemberWithUser } from '../../shared/generated/models/ChatroomMemberWithUser';
import Loading from '../../shared/components/Loading/Loading';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { ChatControllerGetChatroomMembersRequest } from '../../shared/generated/apis/ChatApi';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { Query } from '../../shared/types';

export default function ChatroomDetailsPage() {
  // TODO: is the authUser is not a chatroom member, maybe this should return
  // a notfound. Otherwise, the api will return error responses, but we will
  // still draw the page. Check such authentication validation in other pages
  const { warn } = useNotificationContext();
  const { chatroomId } = useParams();
  const { goBack, navigate } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom } = useData<Chatroom>(getChatroom);
  const { authUser } = useAuth();
  const isOwner: boolean = authUser?.id === chatroom?.ownerId;
  const mapChatMemberToRow = (member: ChatroomMemberWithUser): RowItem => {
    return {
      iconVariant: IconVariant.EDIT,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${member.avatarId}`,
        status: 'offline',
        XCoordinate: member.avatarX,
        YCoordinate: member.avatarY,
      },
      // TODO: Decide where does this url point to when the auth user is not an owner or admin
      url: `${CHATROOM_URL}/${chatroomId}/member/${member.username}/edit`,
      title: member.username,
      subtitle: 'level x',
      key: member.userId,
    };
  };
  const leaveChatroom = useCallback(async () => {
    if (!chatroomId) return;
    try {
      await chatApi.chatControllerLeaveChatroom({ chatroomId: chatroomId });
      navigate(`${CHAT_URL}`);
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
        warn('Could not leave the chatroom');
      }
    }
  }, [warn, chatroomId, navigate]);

  const editChatroom = useCallback(async () => {
    if (!chatroomId) return;
    navigate(`${CHATROOM_URL}/${chatroomId}/edit`);
  }, [chatroomId, navigate]);

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

  if (isOwner) {
    button = {
      buttonSize: ButtonSize.SMALL,
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.ARROW_FORWARD,
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
  if (!(authUser && chatroom)) {
    return (
      <div className="chatroom-details-page">
        <div className="chatroom-details-page-loading">
          <Loading />
        </div>
      </div>
    );
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
        <MediumAvatar
          url={`${AVATAR_EP_URL}/${chatroom.avatarId}`}
          XCoordinate={chatroom.avatarX}
          YCoordinate={chatroom.avatarY}
        />
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
