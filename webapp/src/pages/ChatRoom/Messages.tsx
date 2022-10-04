import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
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
            <span className="message-username">{message.user.username}:</span>
            <span className="message-content">{message.content}</span>
            <span className="message-date">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
    </div>
  );
}

export default Messages;
