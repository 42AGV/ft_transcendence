import React, { useState } from 'react';
import { Button, ButtonVariant } from '../../../../shared/components';
import socket from '../../../../shared/socket';
import './ChatRoomMessageInput.css';

type ChatRoomMessageInputProps = {
  to: string;
};

const ChatRoomMessageInput = ({ to }: ChatRoomMessageInputProps) => {
  const [value, setValue] = useState('');

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('chatRoomMessage', { chatRoomId: to, content: value });
    setValue('');
  };

  const handleOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <form className="chat-room-message-input-form" onSubmit={handleOnSubmit}>
      <div
        className="chat-room-message-input-grow-wrap paragraph-regular"
        data-replicated-value={value}
      >
        <textarea
          className="chat-room-message-input-text paragraph-regular"
          placeholder="Type your message"
          value={value}
          rows={1}
          onInput={handleOnInput}
        />
      </div>
      <Button variant={ButtonVariant.SUBMIT}>Send</Button>
    </form>
  );
};

export default ChatRoomMessageInput;
