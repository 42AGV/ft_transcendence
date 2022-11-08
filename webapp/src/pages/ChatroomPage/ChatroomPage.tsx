import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ChatroomMessageInput, ChatroomMessages } from './components';
import {
  Header,
  IconVariant,
  Loading,
  Text,
  TextColor,
  TextVariant,
} from '../../shared/components';
import { CHATROOM_URL } from '../../shared/urls';
import socket from '../../shared/socket';
import './ChatroomPage.css';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { SubmitStatus, WsException } from '../../shared/types';
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
  const [status, setStatus] = useState<SubmitStatus>({
    type: 'pending',
    message: '',
  });
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
      setStatus({ type: 'error', message: wsError.message });
    });
    socket.emit('joinChatroom', { chatroomId });

    return () => {
      socket.off('exception');
      socket.emit('leaveChatroom', { chatroomId });
    };
  }, [chatroomId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus({ type: 'pending', message: '' });
    }, 5000);
    return () => clearTimeout(timer);
  }, [status]);

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
    return <Navigate to={`${CHATROOM_URL}/${chatroomId}/join`} />;
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
      <div className="chatroom-status">
        <Text
          variant={TextVariant.PARAGRAPH}
          color={
            status.type === 'success' ? TextColor.ONLINE : TextColor.OFFLINE
          }
        >
          {status.message}
        </Text>
      </div>
    </div>
  );
}
