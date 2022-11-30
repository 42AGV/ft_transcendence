import * as React from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../shared/hooks/UseAuth';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import {
  ChatMessagingTemplate,
  ChatMessagingLoading,
} from '../../shared/components';
import { ChatMessageWithUser, User } from '../../shared/generated';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useData } from '../../shared/hooks/UseData';
import { ChatMessage as ChatMessageTemplate } from '../../shared/components/templates/ChatMessagingTemplate/components/ChatMessages/ChatMessages';
import socket from '../../shared/socket';
import { WsException } from '../../shared/types';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

type ChatWithUserProps = {
  username: string;
  authUser: User;
};

type ChatProps = {
  user: User;
  authUser: User;
};

export default function ChatPage() {
  const { username } = useParams();
  const { authUser } = useAuth();

  if (!authUser) {
    return null;
  } else if (!username) {
    return <NotFoundPage />;
  }

  return <ChatWithUser username={username} authUser={authUser} />;
}

function ChatWithUser({ username, authUser }: ChatWithUserProps) {
  const fetchUser = React.useCallback(
    () =>
      usersApi.userControllerGetUserByUserName({
        userName: username,
      }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(fetchUser);

  if (isUserLoading && !user) {
    return <ChatMessagingLoading />;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <Chat user={user} authUser={authUser} />;
}

function Chat({ user, authUser }: ChatProps) {
  const { warn } = useNotificationContext();

  const messageMapper = React.useCallback(
    (msg: ChatMessageWithUser): ChatMessageTemplate => ({
      id: msg.id,
      userId: msg.senderId,
      userName: msg.username,
      avatarId: msg.avatarId,
      content: msg.content,
      createdAt: msg.createdAt,
    }),
    [],
  );

  const fetchMessagesCallback = React.useCallback(
    async (offset: number) => {
      const msgs = await chatApi.chatControllerGetChatMessages({
        userId: user.id,
        limit: ENTRIES_LIMIT,
        offset,
      });
      return msgs.map((msg) => {
        return messageMapper(msg);
      });
    },
    [user, messageMapper],
  );

  React.useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      warn(wsError.message);
    });

    return () => {
      socket.off('exception');
    };
  }, [warn]);

  return (
    <ChatMessagingTemplate
      title={user.username}
      to={user.id}
      from={authUser.username}
      fetchMessagesCallback={fetchMessagesCallback}
      chatEvent="chatMessage"
      messageMapper={messageMapper}
    />
  );
}
