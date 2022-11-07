import { useCallback, useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../../../shared/components';
import { ENTRIES_LIMIT } from '../../../../shared/constants';
import { ChatroomMessageWithUser } from '../../../../shared/generated';
import { useAuth } from '../../../../shared/hooks/UseAuth';
import { useData } from '../../../../shared/hooks/UseData';
import { chatApi } from '../../../../shared/services/ApiService';
import socket from '../../../../shared/socket';
import { AVATAR_EP_URL } from '../../../../shared/urls';
import './ChatroomMessages.css';

type ChatroomMessagesProps = {
  from: string;
};

function ChatroomMessages({ from }: ChatroomMessagesProps) {
  const [messages, setMessages] = useState<ChatroomMessageWithUser[]>([]);
  const getMessages = useCallback(
    () =>
      chatApi.chatControllerGetChatroomMessages({
        chatroomId: from,
        limit: ENTRIES_LIMIT,
      }),
    [from],
  );
  const { data: prevChatroomMessages } = useData(getMessages);
  const { authUser: me } = useAuth();

  useEffect(() => {
    if (prevChatroomMessages) {
      setMessages(prevChatroomMessages);
    }
  }, [prevChatroomMessages]);

  useEffect(() => {
    const messagesListener = (messages: ChatroomMessageWithUser[]) => {
      setMessages(messages);
    };

    const messageListener = (message: ChatroomMessageWithUser) => {
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
