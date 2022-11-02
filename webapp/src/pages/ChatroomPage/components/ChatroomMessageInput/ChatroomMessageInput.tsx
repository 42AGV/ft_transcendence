import React, { useState } from 'react';
import socket from '../../../../shared/socket';
import './ChatroomMessageInput.css';

type ChatroomMessageInputProps = {
  to: string;
};

const ChatroomMessageInput = ({ to }: ChatroomMessageInputProps) => {
  const [value, setValue] = useState('');

  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      value !== '' &&
        socket.emit('chatroomMessage', { chatroomId: to, content: value });
      setValue('');
    }
  };

  const handleOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <form className="chatroom-message-input-form">
      <div
        className="chatroom-message-input-grow-wrap paragraph-regular"
        data-replicated-value={value}
      >
        <textarea
          className="chatroom-message-input-text paragraph-regular"
          placeholder="Type your message"
          value={value}
          rows={1}
          onInput={handleOnInput}
          onKeyDown={onEnterPress}
        />
      </div>
    </form>
  );
};

export default ChatroomMessageInput;
