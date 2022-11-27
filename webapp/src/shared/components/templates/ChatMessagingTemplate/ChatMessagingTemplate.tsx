import * as React from 'react';

import { Header, IconVariant } from '../../index';
import { useNavigation } from '../../../hooks/UseNavigation';
import ChatMessages, {
  ChatMessage,
} from './components/ChatMessages/ChatMessages';
import ChatMessagingInput from './components/ChatMessagingInput/ChatMessagingInput';
import { useData } from '../../../hooks/UseData';
import socket from '../../../socket';
import { Loading } from '../../index';

import './ChatMessagingTemplate.css';

export type ChatEventType = 'chatMessage' | 'chatroomMessage';

type ChatMessagingProps = {
  title: string;
  titleNavigationUrl: string;
  to: string;
  from: string;
  blocks?: Set<string>;
  fetchMessagesCallback: (
    from: string,
    offset: number,
  ) => Promise<ChatMessage[]>;
  chatEvent: ChatEventType;
};

export function ChatMessagingLoading() {
  return (
    <div className="chat-template">
      <div className="chat-template-loading">
        <Loading />
      </div>
    </div>
  );
}

export default function ChatMessagingTemplate({
  title,
  titleNavigationUrl,
  to,
  from,
  blocks = new Set(),
  fetchMessagesCallback,
  chatEvent,
}: ChatMessagingProps) {
  const { goBack } = useNavigation();

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [offset, setOffset] = React.useState(0);
  const getMessages = React.useCallback(
    () => fetchMessagesCallback(from, offset),
    [from, offset, fetchMessagesCallback],
  );
  const { data: newMessages } = useData(getMessages);

  React.useEffect(() => {
    if (newMessages) {
      setMessages((prevMessages) => {
        const reversedChatroomMessages = newMessages.slice().reverse();
        const messages = [...reversedChatroomMessages, ...prevMessages];
        return messages;
      });
    }
  }, [newMessages]);

  React.useEffect(() => {
    const messageListener = (message: ChatMessage) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    socket.on(chatEvent, messageListener);

    return () => {
      socket.off(chatEvent);
    };
  }, [from, chatEvent]);

  return (
    <div className="chat-template">
      <div className="chat-template-header">
        <Header
          icon={IconVariant.ARROW_BACK}
          onClick={goBack}
          titleNavigationUrl={titleNavigationUrl}
        >
          {title}
        </Header>
      </div>
      <div className="chat-template-messages">
        <ChatMessages
          messages={messages}
          blocks={blocks}
          setOffset={setOffset}
        />
      </div>
      <div className="chat-template-message-input">
        <ChatMessagingInput to={to} chatEvent={chatEvent} />
      </div>
    </div>
  );
}
