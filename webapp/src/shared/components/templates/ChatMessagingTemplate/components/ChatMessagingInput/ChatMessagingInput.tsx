import * as React from 'react';

import { ChatEventType } from '../../ChatMessagingTemplate';
import socket from '../../../../../socket';
import {
  Button,
  ButtonSize,
  ButtonVariant,
  IconVariant,
} from '../../../../index';

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
      value !== '' && socket.emit(chatEvent, { id: to, content: value });
      setValue('');
    }
  };

  const handleButtonSend = (e: React.MouseEvent): void => {
    e.preventDefault();
    value !== '' && socket.emit(chatEvent, { id: to, content: value });
    setValue('');
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
        <Button
          variant={ButtonVariant.SUBMIT}
          iconVariant={IconVariant.SEND}
          onClick={handleButtonSend}
          buttonSize={ButtonSize.SMALL}
        />
      </div>
    </form>
  );
}
