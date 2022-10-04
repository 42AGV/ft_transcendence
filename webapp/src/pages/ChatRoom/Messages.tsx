import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Text, TextColor, TextVariant } from '../../shared/components';
import { User } from '../../shared/generated';
import './Messages.css';

type MessagesProps = {
  socket: Socket;
};

type MessageType = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
};

function Messages({ socket }: MessagesProps) {
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
  }, [socket]);

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
            <Text variant={TextVariant.PARAGRAPH} color={TextColor.LIGHT}>
              {message.content}
            </Text>
            <Text variant={TextVariant.PARAGRAPH} color={TextColor.LIGHT}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </Text>
          </div>
        ))}
    </div>
  );
}

export default Messages;
