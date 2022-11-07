import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatroomMessageInput, ChatroomMessages } from './components';
import { Header, IconVariant, Loading } from '../../shared/components';
import socket from '../../shared/socket';
import './ChatroomPage.css';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { WsException } from '../../shared/types';
import { useData } from '../../shared/hooks/UseData';
import { chatApi } from '../../shared/services/ApiService';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useAuth } from '../../shared/hooks/UseAuth';
import { User } from '../../shared/generated';

export default function ChatroomPage() {
  const { chatroomId } = useParams();
  const { authUser } = useAuth();

  if (!chatroomId || !authUser) {
    return null;
  }
  return <Chatroom chatroomId={chatroomId} authUser={authUser} />;
}

type ChatroomProps = {
  chatroomId: string;
  authUser: User;
};

function Chatroom({ chatroomId, authUser }: ChatroomProps) {
  const { goBack } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId }),
    [chatroomId],
  );
  const { data: chatroom, isLoading: isChatroomLoading } = useData(getChatroom);
  const getChatroomMember = useCallback(
    () =>
      chatApi.chatControllerGetChatroomMember({
        chatroomId,
        userId: authUser.id,
      }),
    [chatroomId, authUser.id],
  );
  const { data: chatroomMember, isLoading: isChatroomMemberLoading } =
    useData(getChatroomMember);

  useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      // TODO Add error notification in case of an WebSocket exception
      console.log(wsError);
    });
    socket.emit('joinChatroom', { chatroomId });

    return () => {
      socket.off('exception');
      socket.emit('leaveChatroom', { chatroomId });
    };
  }, [chatroomId]);

  if (isChatroomLoading || isChatroomMemberLoading) {
    return (
      <div className="chatroom">
        <div className="chatroom-loading">
          <Loading />
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return <NotFoundPage />;
  }

  if (!chatroomMember) {
    // TODO Redirect to the chatroom details page, where the user can join this chatroom
    window.location.assign('/api#/chat/ChatController_createChatroomMember');
  }

  return (
    <div className="chatroom">
      <div className="chatroom-header">
        <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
          {chatroom.name}
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
