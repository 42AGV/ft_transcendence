import Messages from './Messages';
import MessageInput from './MessageInput';
import { Text, TextColor, TextVariant } from '../../shared/components';

import './ChatRoom.css';

function ChatRoom() {
  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <Text variant={TextVariant.HEADING} color={TextColor.LIGHT}>
          Chat Room
        </Text>
      </div>
      <div className="chat-room-container">
        <Messages />
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatRoom;
