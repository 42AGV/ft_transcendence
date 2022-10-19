import React, { useRef, useState } from 'react';
import { Button, ButtonVariant } from '../../../../shared/components';
import socket from '../../../../shared/socket';
import './MessageInput.css';

type MessageInputProps = {
  to: string;
};

const MessageInput = ({ to }: MessageInputProps) => {
  const [value, setValue] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', { roomId: to, content: value });
    setValue('');
    if (divRef.current) {
      divRef.current.dataset.replicatedValue = '';
    }
  };

  const handleOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (divRef.current) {
      divRef.current.dataset.replicatedValue = e.currentTarget.value;
      setValue(e.currentTarget.value);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleOnSubmit}>
      <div className="message-input-grow-wrap paragraph-regular" ref={divRef}>
        <textarea
          className="message-input-text paragraph-regular"
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

export default MessageInput;
