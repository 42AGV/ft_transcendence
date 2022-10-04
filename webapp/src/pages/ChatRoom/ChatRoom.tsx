import Messages from './Messages';
import MessageInput from './MessageInput';
import { Header, IconVariant } from '../../shared/components';

import './ChatRoom.css';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../shared/callbacks';

function ChatRoom() {
  const navigate = useNavigate();

  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <Header icon={IconVariant.ARROW_BACK} onClick={goBack(navigate)}>
          Chat Room
        </Header>
      </div>
      <div className="chat-room-messages">
        <Messages />
      </div>
      <div className="chat-room-message-input">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatRoom;
