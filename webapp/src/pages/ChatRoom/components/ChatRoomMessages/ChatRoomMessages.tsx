import { useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../../../shared/components';
import { User } from '../../../../shared/generated';
import { useAuth } from '../../../../shared/hooks/UseAuth';
import socket from '../../../../shared/socket';
import { AVATAR_EP_URL } from '../../../../shared/urls';
import './ChatRoomMessages.css';

type ChatRoomMessageType = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
  chatRoomId: string;
};

type ChatRoomMessagesProps = {
  from: string;
};

function ChatRoomMessages({ from }: ChatRoomMessagesProps) {
  const [messages, setMessages] = useState<ChatRoomMessageType[]>([]);
  const { authUser: me } = useAuth();

  useEffect(() => {
    const messagesListener = (messages: ChatRoomMessageType[]) => {
      setMessages(messages);
    };

    const messageListener = (message: ChatRoomMessageType) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    socket.on('chatRoomMessage', messageListener);
    socket.on('chatRoomMessages', messagesListener);
    socket.emit('getChatRoomMessages', from);

    return () => {
      socket.off('chatRoomMessage');
      socket.off('chatRoomMessages');
    };
  }, [from]);

  return (
    <ul className="chat-room-messages-list">
      {messages.map((message, index) => {
        const isConsecutive =
          index !== messages.length - 1 &&
          messages[index].user.id === messages[index + 1].user.id;
        const isFirst =
          index === 0 ||
          messages[index].user.id !== messages[index - 1].user.id;
        return (
          <li key={message.id} className="chat-room-messages-list-item">
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

export default ChatRoomMessages;
