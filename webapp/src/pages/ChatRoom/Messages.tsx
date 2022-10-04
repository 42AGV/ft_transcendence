import { useEffect, useState } from 'react';
import { Text, TextColor, TextVariant } from '../../shared/components';
import { User } from '../../shared/generated';
import socket from '../../shared/socket';
import './Messages.css';

type MessageType = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
};

function Messages() {
  const [messages, setMessages] = useState<Record<string, MessageType>>({});

  useEffect(() => {
    const messageListener = (message: MessageType) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[message.id] = message;
        return newMessages;
      });
    };

    socket.on('message', messageListener);
    socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
    };
  }, []);

  return (
    <div className="message-list">
      {[...Object.values(messages)]
        .sort((a: MessageType, b: MessageType) => a.createdAt - b.createdAt)
        .map((message) => (
          <div
            key={message.id}
            className="message-container"
            title={`Sent at ${new Date(
              message.createdAt,
            ).toLocaleTimeString()}`}
          >
            <Text variant={TextVariant.PARAGRAPH} color={TextColor.LIGHT}>
              {`${message.user.username}: `}
            </Text>
            <div className="message-content">
              <Text variant={TextVariant.PARAGRAPH} color={TextColor.LIGHT}>
                {message.content}
              </Text>
            </div>
            <Text variant={TextVariant.PARAGRAPH} color={TextColor.LIGHT}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </Text>
          </div>
        ))}
    </div>
  );
}

export default Messages;
