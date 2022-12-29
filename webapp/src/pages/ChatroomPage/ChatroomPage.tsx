import { useCallback, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CHATS_URL, CHATROOM_URL } from '../../shared/urls';
import socket from '../../shared/socket';
import { WsException } from '../../shared/types';
import { useData } from '../../shared/hooks/UseData';
import { chatApi } from '../../shared/services/ApiService';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import {
  ChatroomMessageWithUser,
  UserWithAuthorizationResponseDto,
} from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import {
  ChatMessagingTemplate,
  ChatMessagingLoading,
} from '../../shared/components';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { ChatMessage } from '../../shared/components/templates/ChatMessagingTemplate/components/ChatMessages/ChatMessages';

export default function ChatroomPage() {
  const { chatroomId } = useParams();
  const { authUser } = useAuth();

  if (!chatroomId || !authUser) {
    return null;
  }
  return <Chatroom chatroomId={chatroomId} authUser={authUser} />;
}

type ChatroomProps = {
  chatroomId: string;
  authUser: UserWithAuthorizationResponseDto;
  overridePermissions?: boolean;
};

function Chatroom({
  chatroomId,
  authUser,
  overridePermissions = false,
}: ChatroomProps) {
  const { warn } = useNotificationContext();

  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId }),
    [chatroomId],
  );

  const getChatroomMember = useCallback(
    () =>
      chatApi.chatControllerGetChatroomMember({
        chatroomId,
        userId: authUser.id,
      }),
    [chatroomId, authUser],
  );

  const messageMapper = useCallback(
    (msg: ChatroomMessageWithUser): ChatMessage => ({
      id: msg.id,
      userId: msg.user.id,
      userName: msg.user.username,
      avatarId: msg.user.avatarId,
      content: msg.content,
      createdAt: msg.createdAt,
    }),
    [],
  );

  const fetchMessagesCallback = useCallback(
    async (offset: number) => {
      const msgs = await chatApi.chatControllerGetChatroomMessages({
        chatroomId,
        limit: ENTRIES_LIMIT,
        offset,
      });
      return msgs.map((msg) => messageMapper(msg));
    },
    [chatroomId, messageMapper],
  );

  const { data: chatroom, isLoading: isChatroomLoading } = useData(getChatroom);

  const { data: chatroomMember, isLoading: isChatroomMemberLoading } =
    useData(getChatroomMember);

  const enableNotifications =
    (chatroom !== null && chatroomMember !== null && !chatroomMember.banned) ||
    authUser.gAdmin ||
    authUser.gOwner;

  useEffect(() => {
    socket.emit('joinChatroom', { chatroomId });

    return () => {
      socket.emit('leaveChatroom', { chatroomId });
    };
  }, [chatroomId]);

  useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      if (enableNotifications) {
        warn(wsError.message);
      }
    });

    return () => {
      socket.off('exception');
    };
  }, [warn, enableNotifications]);

  if (isChatroomLoading || isChatroomMemberLoading) {
    return <ChatMessagingLoading />;
  }

  if (!chatroom) {
    return <NotFoundPage />;
  }

  if (!(overridePermissions && (authUser.gAdmin || authUser.gOwner))) {
    if (!chatroomMember) {
      return <Navigate to={`${CHATROOM_URL}/${chatroomId}/join`} replace />;
    }

    if (chatroomMember.banned) {
      return <Navigate to={`${CHATS_URL}`} replace />;
    }
  }

  return (
    <ChatMessagingTemplate
      title={chatroom.name}
      titleNavigationUrl={`${CHATROOM_URL}/${chatroomId}/details`}
      to={chatroomId}
      chatEvent="chatroomMessage"
      fetchMessagesCallback={fetchMessagesCallback}
      messageMapper={messageMapper}
    />
  );
}
