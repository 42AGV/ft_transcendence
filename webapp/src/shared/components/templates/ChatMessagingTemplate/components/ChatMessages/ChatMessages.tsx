import * as React from 'react';

import { ChatBubble, ChatBubbleVariant } from '../../../../index';
import { AVATAR_EP_URL } from '../../../../../urls';
import { ENTRIES_LIMIT } from '../../../../../constants';
import { User } from '../../../../../generated';
import { useIsElementVisible } from '../../../../../hooks/UseIsElementVisible';
import { useAuth } from '../../../../../hooks/UseAuth';

import './ChatMessages.css';

export type ChatMessage = {
  id: string;
  user: User;
  content: string;
  createdAt: Date;
};

type ChatMessagesProps = {
  messages: ChatMessage[];
  blocks: Set<string>;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
};

export default function ChatMessages({
  messages,
  blocks,
  setOffset,
}: ChatMessagesProps) {
  const { ref: callbackRef, isVisible } = useIsElementVisible();
  const { authUser: me } = useAuth();

  React.useEffect(() => {
    if (isVisible) {
      setOffset((prevOffset) => prevOffset + ENTRIES_LIMIT);
    }
  }, [isVisible, setOffset]);

  return (
    <ul className="chat-template-messages-list">
      {messages
        .filter((message) => !blocks.has(message.user.id))
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
              className="chat-template-messages-list-item"
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
