import { useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../../../shared/components';
import { User } from '../../../../shared/generated';
import { useAuth } from '../../../../shared/hooks/UseAuth';
import socket from '../../../../shared/socket';
import { AVATAR_EP_URL, WILDCARD_AVATAR_URL } from '../../../../shared/urls';
import './Messages.css';

type MessageType = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
};

type MessagesProps = {
  from: string;
};

function Messages({ from }: MessagesProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { authUser: me } = useAuth();

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

    socket.on('message', messageListener);
    socket.on('messages', messagesListener);
    socket.emit('getMessages', from);

    return () => {
      socket.off('message');
      socket.off('messages');
    };
  }, [from]);

  return (
    <ul className="messages-list">
      {messages.map((message, index) => {
        const isConsecutive =
          index !== messages.length - 1 &&
          messages[index].user.id === messages[index + 1].user.id;
        const isFirst =
          index === 0 ||
          messages[index].user.id !== messages[index - 1].user.id;
        return (
          <li key={message.id} className="messages-list-item">
            <ChatBubble
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
              }}
              isConsecutive={isConsecutive}
              isFirst={isFirst}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default Messages;
