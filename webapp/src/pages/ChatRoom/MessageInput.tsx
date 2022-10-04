import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { Input, InputVariant } from '../../shared/components';
import './MessageInput.css';

type NewMessagesProps = {
  socket: Socket;
};

const NewMessage = ({ socket }: NewMessagesProps) => {
  const [value, setValue] = useState('');
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('message', value);
    setValue('');
  };

  return (
    <form className="message-input-form" onSubmit={submitForm}>
      <Input
        variant={InputVariant.LIGHT}
        value={value}
        placeholder="Type your message"
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </form>
  );
};

export default NewMessage;
