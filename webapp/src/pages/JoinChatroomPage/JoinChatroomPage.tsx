import './JoinChatroomPage.css';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
  Text,
  TextVariant,
} from '../../shared/components';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useData } from '../../shared/hooks/UseData';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { chatApi } from '../../shared/services/ApiService';
import { AVATAR_EP_URL, CHATROOM_URL } from '../../shared/urls';
import { handleRequestError } from '../../shared/hooks/HandleRequestError';

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
  const { navigate } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId }),
    [chatroomId],
  );
  const { data: chatroom, isLoading: isChatroomLoading } = useData(getChatroom);
  const isProtectedChatroom = chatroom?.isPublic === false;
  const [password, setPassword] = useState('');
  const { warn, notify } = useNotificationContext();

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
      handleRequestError(error, 'Could not join the chatroom', warn);
    }
  };

  return (
    <div className="join-chatroom-page">
      <AvatarPageTemplate
        isLoading={isChatroomLoading}
        isNotFound={!chatroom}
        title={`channel/${chatroom?.name ?? ''}`}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${chatroom?.avatarId}`,
          XCoordinate: chatroom?.avatarX ?? 0,
          YCoordinate: chatroom?.avatarY ?? 0,
        }}
        button={{
          variant: ButtonVariant.SUBMIT,
          form: 'join-chatroom-form',
          children: 'join',
        }}
      >
        <>
          <div className="join-chatroom-info-text">
            <Text variant={TextVariant.SUBHEADING}>{chatroom?.name ?? ''}</Text>
            <Text variant={TextVariant.PARAGRAPH}>
              {chatroom?.isPublic ? 'public channel' : 'private channel'}
            </Text>
          </div>
          <form
            className="join-chatroom-info-form"
            id="join-chatroom-form"
            onSubmit={handleSubmit}
          >
            {isProtectedChatroom && (
              <Input
                variant={InputVariant.LIGHT}
                label="insert password"
                placeholder="password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            )}
          </form>
        </>
      </AvatarPageTemplate>
    </div>
  );
}
