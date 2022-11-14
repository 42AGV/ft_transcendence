import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Input,
  InputVariant,
  LargeAvatar,
  Loading,
  Text,
  TextVariant,
} from '../../shared/components';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { ResponseError } from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { chatApi } from '../../shared/services/ApiService';
import {
  CHATROOM_EP_URL,
  CHATROOM_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './JoinChatroomPage.css';

export default function JoinChatroomPage() {
  const { chatroomId } = useParams();

  if (!chatroomId) {
    return null;
  }
  return <JoinChatroom chatroomId={chatroomId} />;
}

type JoinChatroomProps = {
  chatroomId: string;
};

function JoinChatroom({ chatroomId }: JoinChatroomProps) {
  const { goBack } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId }),
    [chatroomId],
  );
  const { data: chatroom, isLoading: isChatroomLoading } = useData(getChatroom);
  const isProtectedChatroom = chatroom?._public === false;
  const [password, setPassword] = useState('');
  const { warn, notify } = useNotificationContext();
  const { navigate } = useNavigation();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    try {
      await chatApi.chatControllerCreateChatroomMember({
        chatroomId: chatroomId,
        joinChatroomDto: {
          password: isProtectedChatroom ? password : undefined,
        },
      });
      notify('You joined a chatroom');
      navigate(`${CHATROOM_URL}/${chatroomId}`, { replace: true });
    } catch (error: unknown) {
      if (error instanceof ResponseError) {
        const responseBody = await error.response.json();
        if (responseBody.message) {
          warn(responseBody.message);
        } else {
          warn(error.response.statusText);
        }
      } else if (error instanceof Error) {
        warn(error.message);
      } else {
        warn('Could not join the chatroom');
      }
    }
  };

  if (isChatroomLoading) {
    return (
      <div className="join-chatroom">
        <div className="join-chatroom-loading">
          <Loading />
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return <NotFoundPage />;
  }

  return (
    <div className="join-chatroom">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        join chatroom
      </Header>
      <div className="join-chatroom-avatar">
        <LargeAvatar
          url={
            // TODO: Remove the wildcard avatar when we implement #317
            chatroom.avatarId
              ? `${CHATROOM_EP_URL}/${chatroomId}/avatars/${chatroom.avatarId}`
              : WILDCARD_AVATAR_URL
          }
          XCoordinate={chatroom.avatarX}
          YCoordinate={chatroom.avatarY}
        />
      </div>
      <div className="join-chatroom-info">
        <div className="join-chatroom-info-text">
          <Text variant={TextVariant.PARAGRAPH}>{chatroom.name}</Text>
        </div>
        <form className="join-chatroom-info-form" onSubmit={handleSubmit}>
          {isProtectedChatroom && (
            <Input
              variant={InputVariant.LIGHT}
              placeholder="password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          )}
          <Button variant={ButtonVariant.SUBMIT}>join</Button>
        </form>
      </div>
    </div>
  );
}
