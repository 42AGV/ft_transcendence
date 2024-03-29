import * as React from 'react';

import { Header, IconVariant } from '../../index';
import { useNavigation } from '../../../hooks/UseNavigation';
import ChatMessages, {
  ChatMessage,
} from './components/ChatMessages/ChatMessages';
import ChatMessagingInput from './components/ChatMessagingInput/ChatMessagingInput';
import { useData } from '../../../hooks/UseData';
import socket from '../../../socket';

import './ChatMessagingTemplate.css';

export type ChatEventType = 'chatMessage' | 'chatroomMessage';

type ChatMessagingProps = {
  title: string;
  titleNavigationUrl?: string;
  to: string;
  fetchMessagesCallback: (offset: number) => Promise<ChatMessage[]>;
  chatEvent: ChatEventType;
  messageMapper: (msg: any) => ChatMessage;
};

export default function ChatMessagingTemplate({
  title,
  titleNavigationUrl,
  to,
  fetchMessagesCallback,
  chatEvent,
  messageMapper,
}: ChatMessagingProps) {
  const { goBack } = useNavigation();

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [offset, setOffset] = React.useState(0);
  const getMessages = React.useCallback(
    () => fetchMessagesCallback(offset),
    [offset, fetchMessagesCallback],
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
  }, [newMessages, messageMapper]);

  React.useEffect(() => {
    const messageListener = (message: ChatMessage) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, messageMapper(message)];
        return newMessages;
      });
    };

    socket.on(chatEvent, messageListener);

    return () => {
      socket.off(chatEvent);
    };
  }, [chatEvent, messageMapper]);

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
        <ChatMessages messages={messages} setOffset={setOffset} />
      </div>
      <div className="chat-template-message-input">
        <ChatMessagingInput to={to} chatEvent={chatEvent} />
      </div>
    </div>
  );
}
