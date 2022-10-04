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
  const { user } = useAuth();

  useEffect(() => {
    const messageListener = (message: MessageType) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    const messagesListener = (messages: MessageType[]) => {
      setMessages(messages);
    };

    socket.on('message', messageListener);
    socket.on('messages', messagesListener);
    socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
      socket.off('messages', messageListener);
    };
  }, []);

  return (
    <div className="messages-list">
      {[...Object.values(messages)]
        .sort((a: MessageType, b: MessageType) => a.createdAt - b.createdAt)
        .map((message) => (
          <ChatBubble
            text={message.content}
            variant={
              user && user.id === message.user.id
                ? ChatBubbleVariant.SELF
                : ChatBubbleVariant.OTHER
            }
            key={message.id}
            name={message.user.username}
            avatar={{
              url: message.user.avatarId
                ? `${AVATAR_EP_URL}/${message.user.avatarId}`
                : WILDCARD_AVATAR_URL,
            }}
          />
        ))}
    </div>
  );
}

export default Messages;
