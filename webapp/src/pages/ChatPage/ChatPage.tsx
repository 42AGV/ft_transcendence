import * as React from 'react';
import { useParams } from 'react-router-dom';

import { USER_URL } from '../../shared/urls';
import { useAuth } from '../../shared/hooks/UseAuth';
import { chatApi, usersApi } from '../../shared/services/ApiService';
import { ChatMessagingTemplate } from '../../shared/components';
import { ChatMessage, User } from '../../shared/generated';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { useData } from '../../shared/hooks/UseData';
import { Loading } from '../../shared/components';
import { ChatMessage as ChatMessageTemplate } from '../../shared/components/templates/ChatMessagingTemplate/components/ChatMessages/ChatMessages';

const messageMapper = (msg: ChatMessage, user: User): ChatMessageTemplate => ({
  id: msg.id,
  user: user,
  content: msg.content,
  createdAt: msg.createdAt,
});

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

  if (!username || !authUser) {
    return null;
  }

  return <ChatWithUser username={username} authUser={authUser} />;
}

function ChatWithUser({ username, authUser }: ChatWithUserProps) {
  const fetchUser = React.useCallback(
    () =>
      usersApi.userControllerGetUserByUserName({
        userName: username,
      }),
    [],
  );
  const { data: user, isLoading: isUserLoading } = useData(fetchUser);

  // arreglar clases
  if (isUserLoading || !user) {
    return (
      <div className="chatroom">
        <div className="chatroom-loading">
          <Loading />
        </div>
      </div>
    );
  }
  return <Chat user={user} authUser={authUser} />;
}

function Chat({ user, authUser }: ChatProps) {
  const fetchMessagesCallback = React.useCallback(async () => {
    const msgs = await chatApi.chatControllerGetChatMessages({
      userId: user.id,
      limit: ENTRIES_LIMIT,
      offset: 0,
    });
    return msgs.map((msg) => messageMapper(msg, user));
  }, [user]);

  const username = user.username;

  return (
    <ChatMessagingTemplate
      title={username}
      titleNavigationUrl={`${USER_URL}/${username}`}
      to={username}
      from={authUser.username}
      fetchMessagesCallback={fetchMessagesCallback}
      chatEvent="chatMessage"
    />
  );
}
