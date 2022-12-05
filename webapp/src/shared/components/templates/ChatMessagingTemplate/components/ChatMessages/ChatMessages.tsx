import * as React from 'react';

import { ChatBubble, ChatBubbleVariant } from '../../../../index';
import { AVATAR_EP_URL } from '../../../../../urls';
import { ENTRIES_LIMIT } from '../../../../../constants';
import { useIsElementVisible } from '../../../../../hooks/UseIsElementVisible';
import { useAuth } from '../../../../../hooks/UseAuth';
import { useBlocklist } from '../../../../../hooks/UseBlocklist';

import './ChatMessages.css';

export type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  avatarId: string;
  content: string;
  createdAt: Date;
};

type ChatMessagesProps = {
  messages: ChatMessage[];
  setOffset: React.Dispatch<React.SetStateAction<number>>;
};

export default function ChatMessages({
  messages,
  setOffset,
}: ChatMessagesProps) {
  const { ref: callbackRef, isVisible } = useIsElementVisible();
  const { authUser: me } = useAuth();
  const { userBlocks } = useBlocklist();

  React.useEffect(() => {
    if (isVisible) {
      setOffset((prevOffset) => prevOffset + ENTRIES_LIMIT);
    }
  }, [isVisible, setOffset]);

  return (
    <ul className="chat-template-messages-list">
      {messages
        .filter((message) => !userBlocks(message.userId))
        .map((message, index, array) => {
          const isConsecutive =
            index !== array.length - 1 &&
            array[index].userId === array[index + 1].userId;
          const isFirst =
            index === 0 || array[index].userId !== array[index - 1].userId;
          return (
            <li
              key={message.id}
              ref={index === 0 ? callbackRef : undefined}
              className="chat-template-messages-list-item"
            >
              <ChatBubble
                variant={
                  me && me.id === message.userId
                    ? ChatBubbleVariant.SELF
                    : ChatBubbleVariant.OTHER
                }
                name={message.userName}
                text={message.content}
                avatar={{
                  url: `${AVATAR_EP_URL}/${message.avatarId}`,
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
