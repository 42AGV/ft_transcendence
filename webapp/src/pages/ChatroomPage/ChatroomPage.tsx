import { useCallback, useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { CHATS_URL, CHATROOM_URL, ADMIN_URL } from '../../shared/urls';
import socket from '../../shared/socket';
import { useData } from '../../shared/hooks/UseData';
import { chatApi } from '../../shared/services/ApiService';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import {
  ChatroomMessageWithUser,
  UserWithAuthorizationResponseDto,
} from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { ChatMessagingTemplate } from '../../shared/components';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { ChatMessage } from '../../shared/components/templates/ChatMessagingTemplate/components/ChatMessages/ChatMessages';
import { LoadingPage } from '../index';

export default function ChatroomPage() {
  const { chatroomId } = useParams();
  const { authUser } = useAuth();
  const { pathname } = useLocation();

  if (!chatroomId || !authUser) {
    return <></>;
  }
  return (
    <Chatroom
      chatroomId={chatroomId}
      authUser={authUser}
      overridePermissions={pathname.slice(0, ADMIN_URL.length) === ADMIN_URL}
    />
  );
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

  useEffect(() => {
    socket.emit('joinChatroom', { chatroomId });

    return () => {
      socket.emit('leaveChatroom', { chatroomId });
    };
  }, [chatroomId]);

  if (isChatroomLoading || isChatroomMemberLoading) {
    return <LoadingPage />;
  }

  if (!chatroom) {
    return <NotFoundPage />;
  }

  if (!(overridePermissions && (authUser.gAdmin || authUser.gOwner))) {
    if (!chatroomMember) {
      return <Navigate to={`${CHATROOM_URL}/${chatroomId}/join`} replace />;
    }

    if (chatroomMember.banned && !overridePermissions) {
      return <Navigate to={`${CHATS_URL}`} replace />;
    }
  }

  return (
    <ChatMessagingTemplate
      title={chatroom.name}
      titleNavigationUrl={`${
        overridePermissions ? ADMIN_URL : ''
      }${CHATROOM_URL}/${chatroomId}/details`}
      to={chatroomId}
      chatEvent="chatroomMessage"
      fetchMessagesCallback={fetchMessagesCallback}
      messageMapper={messageMapper}
    />
  );
}
