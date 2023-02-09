import * as React from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../shared/hooks/UseAuth';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import { ChatMessagingTemplate } from '../../shared/components';
import { ChatMessageWithUser, User } from '../../shared/generated';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useData } from '../../shared/hooks/UseData';
import { ChatMessage as ChatMessageTemplate } from '../../shared/components/templates/ChatMessagingTemplate/components/ChatMessages/ChatMessages';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LoadingPage } from '..';
import { USER_URL } from '../../shared/urls';

type ChatWithUserProps = {
  username: string;
};

type ChatProps = {
  user: User;
};

export default function ChatPage() {
  const { username } = useParams();
  const { authUser } = useAuth();

  if (!authUser || !username) {
    return null;
  }

  return <ChatWithUser username={username} />;
}

function ChatWithUser({ username }: ChatWithUserProps) {
  const fetchUser = React.useCallback(
    () =>
      usersApi.userControllerGetUserByUserName({
        userName: username,
      }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(fetchUser);

  if (isUserLoading) {
    return <LoadingPage />;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <Chat user={user} />;
}

function Chat({ user }: ChatProps) {
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

  return (
    <ChatMessagingTemplate
      title={user.username}
      to={user.id}
      titleNavigationUrl={`${USER_URL}/${user.username}`}
      fetchMessagesCallback={fetchMessagesCallback}
      chatEvent="chatMessage"
      messageMapper={messageMapper}
    />
  );
}
