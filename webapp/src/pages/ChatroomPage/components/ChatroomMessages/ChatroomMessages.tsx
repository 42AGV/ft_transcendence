import { useCallback, useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../../../shared/components';
import { ENTRIES_LIMIT } from '../../../../shared/constants';
import { ChatroomMessageWithUser } from '../../../../shared/generated';
import { useAuth } from '../../../../shared/hooks/UseAuth';
import { useData } from '../../../../shared/hooks/UseData';
import { useIsElementVisible } from '../../../../shared/hooks/UseIsElementVisible';
import { chatApi } from '../../../../shared/services/ApiService';
import socket from '../../../../shared/socket';
import { AVATAR_EP_URL } from '../../../../shared/urls';
import './ChatroomMessages.css';

type ChatroomMessagesProps = {
  from: string;
};

function ChatroomMessages({ from }: ChatroomMessagesProps) {
  const [messages, setMessages] = useState<ChatroomMessageWithUser[]>([]);
  const [offset, setOffset] = useState(0);
  const getMessages = useCallback(
    () =>
      chatApi.chatControllerGetChatroomMessages({
        chatroomId: from,
        limit: ENTRIES_LIMIT,
        offset,
      }),
    [from, offset],
  );
  const { data: chatroomMessages } = useData(getMessages);
  const { authUser: me } = useAuth();
  const { ref, isVisible } = useIsElementVisible();

  useEffect(() => {
    if (chatroomMessages) {
      setMessages((prevMessages) => {
        const reversedchatroomMessages = chatroomMessages.slice().reverse();
        const newMessages = [...reversedchatroomMessages, ...prevMessages];
        return newMessages;
      });
    }
  }, [chatroomMessages]);

  useEffect(() => {
    if (isVisible) {
      setOffset((prevOffset) => prevOffset + ENTRIES_LIMIT);
    }
  }, [isVisible]);

  useEffect(() => {
    const messageListener = (message: ChatroomMessageWithUser) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    socket.on('chatroomMessage', messageListener);

    return () => {
      socket.off('chatroomMessage');
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
          <li
            key={message.id}
            ref={index === 0 ? ref : undefined}
            className="chatroom-messages-list-item"
          >
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
