import * as React from 'react';

import { ChatEventType } from '../../ChatMessagingTemplate';
import socket from '../../../../../socket';

import './ChatMessagingInput.css';

type ChatMessagingInputType = {
  to: string;
  chatEvent: ChatEventType;
};

export default function ChatMessagingInput({
  to,
  chatEvent,
}: ChatMessagingInputType) {
  const [value, setValue] = React.useState('');

  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      value !== '' &&
        socket.emit(chatEvent, { chatroomId: to, content: value });
      setValue('');
    }
  };

  const handleOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <form className="chat-template-message-input-form">
      <div
        className="chat-template-message-input-grow-wrap paragraph-regular"
        data-replicated-value={value}
      >
        <textarea
          className="chat-template-message-input-text paragraph-regular"
          placeholder="Type your message"
          value={value}
          rows={1}
          onInput={handleOnInput}
          onKeyDown={onEnterPress}
        />
      </div>
    </form>
  );
}
