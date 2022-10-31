import { useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../../../shared/components';
import { User } from '../../../../shared/generated';
import { useAuth } from '../../../../shared/hooks/UseAuth';
import socket from '../../../../shared/socket';
import { AVATAR_EP_URL } from '../../../../shared/urls';
import './ChatroomMessages.css';

type ChatroomMessageType = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
  chatroomId: string;
};

type ChatroomMessagesProps = {
  from: string;
};

function ChatroomMessages({ from }: ChatroomMessagesProps) {
  const [messages, setMessages] = useState<ChatroomMessageType[]>([]);
  const { authUser: me } = useAuth();

  useEffect(() => {
    const messagesListener = (messages: ChatroomMessageType[]) => {
      setMessages(messages);
    };

    const messageListener = (message: ChatroomMessageType) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    socket.on('chatroomMessage', messageListener);
    socket.on('chatroomMessages', messagesListener);
    socket.emit('getChatroomMessages', from);

    return () => {
      socket.off('chatroomMessage');
      socket.off('chatroomMessages');
    };
  }, [from]);

  return (
    <ul className="chatroom-messages-list">
      {messages.map((message, index) => {
        const isConsecutive =
          index !== messages.length - 1 &&
          messages[index].user.id === messages[index + 1].user.id;
        const isFirst =
          index === 0 ||
          messages[index].user.id !== messages[index - 1].user.id;
        return (
          <li key={message.id} className="chatroom-messages-list-item">
            <ChatBubble
              variant={
                me && me.id === message.user.id
                  ? ChatBubbleVariant.SELF
                  : ChatBubbleVariant.OTHER
              }
              name={message.user.username}
              text={message.content}
              avatar={{
                url: `${AVATAR_EP_URL}/${message.user.avatarId}`,
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

export default ChatroomMessages;
