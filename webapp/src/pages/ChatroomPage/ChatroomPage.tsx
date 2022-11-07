import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatroomMessageInput, ChatroomMessages } from './components';
import { Header, IconVariant } from '../../shared/components';
import socket from '../../shared/socket';
import './ChatroomPage.css';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { WsException } from '../../shared/types';

function Chatroom() {
  const { chatroomId } = useParams();
  const { goBack } = useNavigation();

  useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      // TODO Add error notification in case of an WebSocket exception
      console.log(wsError);
    });
    if (chatroomId) {
      socket.emit('joinChatroom', { chatroomId });
    }

    return () => {
      socket.off('exception');
      if (chatroomId) {
        socket.emit('leaveChatroom', { chatroomId });
      }
    };
  }, [chatroomId]);

  if (!chatroomId) {
    return null;
  }

  return (
    <div className="chatroom">
      <div className="chatroom-header">
        <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
          {chatroomId}
        </Header>
      </div>
      <div className="chatroom-messages">
        <ChatroomMessages from={chatroomId} />
      </div>
      <div className="chatroom-message-input">
        <ChatroomMessageInput to={chatroomId} />
      </div>
    </div>
  );
}

export default Chatroom;
