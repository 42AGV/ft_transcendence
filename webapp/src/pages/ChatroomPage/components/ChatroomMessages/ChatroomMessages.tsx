import { useCallback, useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleVariant } from '../../../../shared/components';
import { ENTRIES_LIMIT } from '../../../../shared/constants';
import { ChatroomMessageWithUser } from '../../../../shared/generated';
import { useAuth } from '../../../../shared/hooks/UseAuth';
import { useData } from '../../../../shared/hooks/UseData';
import { useIsElementVisible } from '../../../../shared/hooks/UseIsElementVisible';
import { chatApi, usersApi } from '../../../../shared/services/ApiService';
import socket from '../../../../shared/socket';
import { AVATAR_EP_URL } from '../../../../shared/urls';
import './ChatroomMessages.css';

type ChatroomMessagesProps = {
  from: string;
};

type BlockedId = string;

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
  const [blocks, setBlocks] = useState(new Set<BlockedId>());
  const getBlockedUsers = useCallback(
    () => usersApi.userControllerGetBlocks(),
    [],
  );
  const { data: blockedUsers } = useData(getBlockedUsers);
  const { authUser: me } = useAuth();
  const { ref: callbackRef, isVisible } = useIsElementVisible();

  useEffect(() => {
    if (blockedUsers) {
      setBlocks(new Set(blockedUsers.map((user) => user.id)));
    }
  }, [blockedUsers]);

  useEffect(() => {
    const handleBlock = (blockedId: BlockedId) => {
      setBlocks((prevBlocks) => new Set([...prevBlocks, blockedId]));
    };

    const handleUnblock = (blockedId: BlockedId) => {
      setBlocks(
        (prevBlocks) =>
          new Set([...prevBlocks].filter((userId) => userId !== blockedId)),
      );
    };

    socket.on('block', handleBlock);
    socket.on('unblock', handleUnblock);

    return () => {
      socket.off('block');
      socket.off('unblock');
    };
  });

  useEffect(() => {
    if (chatroomMessages) {
      setMessages((prevMessages) => {
        const reversedChatroomMessages = chatroomMessages.slice().reverse();
        const newMessages = [...reversedChatroomMessages, ...prevMessages];
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
      {messages
        .filter((message) => !blocks.has(message.userId))
        .map((message, index, array) => {
          const isConsecutive =
            index !== array.length - 1 &&
            array[index].user.id === array[index + 1].user.id;
          const isFirst =
            index === 0 || array[index].user.id !== array[index - 1].user.id;
          return (
            <li
              key={message.id}
              ref={index === 0 ? callbackRef : undefined}
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
