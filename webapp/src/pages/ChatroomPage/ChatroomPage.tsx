import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CHATS_URL, CHATROOM_URL } from '../../shared/urls';
import socket from '../../shared/socket';
import { WsException } from '../../shared/types';
import { useData } from '../../shared/hooks/UseData';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { ChatroomMessageWithUser, User } from '../../shared/generated';
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
  authUser: User;
};

type BlockedId = string;

const messageMapper = (msg: ChatroomMessageWithUser): ChatMessage => ({
  id: msg.id,
  user: msg.user,
  content: msg.content,
  createdAt: msg.createdAt,
});

function Chatroom({ chatroomId, authUser }: ChatroomProps) {
  const [blocks, setBlocks] = useState(new Set<BlockedId>());

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
    [chatroomId, authUser.id],
  );

  const fetchMessagesCallback = useCallback(
    async (from: string, offset: number) => {
      const msgs = await chatApi.chatControllerGetChatroomMessages({
        chatroomId: from,
        limit: ENTRIES_LIMIT,
        offset,
      });
      return msgs.map((msg) => messageMapper(msg));
    },
    [],
  );

  const getBlockedUsers = useCallback(
    () => usersApi.userControllerGetBlocks(),
    [],
  );
  const { data: chatroom, isLoading: isChatroomLoading } = useData(getChatroom);

  const { data: chatroomMember, isLoading: isChatroomMemberLoading } =
    useData(getChatroomMember);
  const { data: blockedUsers } = useData(getBlockedUsers);

  const enableNotifications =
    chatroom !== null && chatroomMember !== null && !chatroomMember.banned;

  useEffect(() => {
    socket.emit('joinChatroom', { chatroomId });

    return () => {
      socket.emit('leaveChatroom', { chatroomId });
    };
  }, [chatroomId, warn, enableNotifications]);

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

  useEffect(() => {
    if (blockedUsers) {
      setBlocks(new Set(blockedUsers.map((user) => user.id)));
    }
  }, [blockedUsers]);

  useEffect(() => {
    const handleBlock = (blockedId: BlockedId) => {
      setBlocks((prevBlocks) => new Set([...prevBlocks, blockedId]));
    };

    const handleUnblock = (blockedId: BlockedId) => {
      setBlocks(
        (prevBlocks) =>
          new Set([...prevBlocks].filter((userId) => userId !== blockedId)),
      );
    };

    socket.on('block', handleBlock);
    socket.on('unblock', handleUnblock);

    return () => {
      socket.off('block');
      socket.off('unblock');
    };
  });

  if (blockedUsers === null) {
    return null;
  }

  if (isChatroomLoading || isChatroomMemberLoading) {
    return <ChatMessagingLoading />;
  }

  if (!chatroom) {
    return <NotFoundPage />;
  }

  if (!chatroomMember) {
    return <Navigate to={`${CHATROOM_URL}/${chatroomId}/join`} replace />;
  }
  if (chatroomMember.banned) {
    return <Navigate to={`${CHATS_URL}`} replace />;
  }

  return (
    <ChatMessagingTemplate
      title={chatroom.name}
      titleNavigationUrl={`${CHATROOM_URL}/${chatroomId}/details`}
      from={chatroomId}
      to={chatroomId}
      blocks={blocks}
      chatEvent="chatroomMessage"
      fetchMessagesCallback={fetchMessagesCallback}
    />
  );
}
