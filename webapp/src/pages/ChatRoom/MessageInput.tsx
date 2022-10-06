import React, { useRef, useState } from 'react';
import { Button, ButtonVariant } from '../../shared/components';
import socket from '../../shared/socket';
import './MessageInput.css';

const MessageInput = () => {
  const [value, setValue] = useState('');
  const messageInputRef = useRef<HTMLDivElement>(null);
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('message', value);
    setValue('');
    if (messageInputRef.current) {
      messageInputRef.current.innerText = '';
    }
  };

  return (
    <form className="message-input-form" onSubmit={submitForm}>
      <div
        className="message-input-text"
        placeholder="Type your message"
        onBeforeInput={(e) => setValue(e.currentTarget.innerText)}
        onBlur={(e) => setValue(e.currentTarget.innerText)}
        contentEditable
        ref={messageInputRef}
      />
      <Button variant={ButtonVariant.SUBMIT}>Send</Button>
    </form>
  );
};

export default MessageInput;
