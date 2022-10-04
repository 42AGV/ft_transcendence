import React, { useState } from 'react';
import { Input, InputVariant } from '../../shared/components';
import socket from '../../shared/socket';
import './MessageInput.css';

const NewMessage = () => {
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
