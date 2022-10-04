import { useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../shared/components';
import { User } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import socket from '../../shared/socket';
import { AVATAR_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';

type MessageType = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
};

function Messages() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<Map<string, User>>(
    new Map<string, User>(),
  );
  const { user: me } = useAuth();

  useEffect(() => {
    const messagesListener = (messages: MessageType[]) => {
      setMessages(messages);
    };

    const messageListener = (message: MessageType) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    const usersListener = (users: User[]) => {
      setConnectedUsers(new Map(users.map((user) => [user.id, user])));
    };

    const userConnectedListener = (newUser: User) => {
      setConnectedUsers(
        (prevConnectedUsers) =>
          new Map(prevConnectedUsers.set(newUser.id, newUser)),
      );
    };

    const userDisconnectedListener = (user: User) => {
      setConnectedUsers((prevConnectedUsers) => {
        prevConnectedUsers.delete(user.id);
        return new Map(prevConnectedUsers);
      });
    };

    socket.on('message', messageListener);
    socket.on('messages', messagesListener);
    socket.on('userConnected', userConnectedListener);
    socket.on('userDisconnected', userDisconnectedListener);
    socket.on('users', usersListener);
    socket.emit('getMessages');
    socket.emit('getConnectedUsers');

    return () => {
      socket.off('message', messageListener);
      socket.off('messages', messageListener);
      socket.off('userConnected', userConnectedListener);
      socket.off('userDisconnected', userDisconnectedListener);
      socket.off('users', usersListener);
    };
  }, []);

  return (
    <div className="messages-list">
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          variant={
            me && me.id === message.user.id
              ? ChatBubbleVariant.SELF
              : ChatBubbleVariant.OTHER
          }
          name={message.user.username}
          text={message.content}
          avatar={{
            url: message.user.avatarId
              ? `${AVATAR_EP_URL}/${message.user.avatarId}`
              : WILDCARD_AVATAR_URL,
            status: connectedUsers.has(message.user.id) ? 'online' : 'offline',
          }}
        />
      ))}
    </div>
  );
}

export default Messages;
