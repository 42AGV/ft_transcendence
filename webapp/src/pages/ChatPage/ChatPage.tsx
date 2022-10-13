import {
  Button,
  ButtonVariant,
  IconVariant,
  RowItem,
} from '../../shared/components';
import {
  AVATAR_EP_URL,
  CHAT_URL,
  COMPONENTS_BOOK_URL,
  CREATE_CHAT_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import {
  Chat,
  ChatControllerGetChatsRequest,
  ChatsApi,
  instanceOfChat,
} from '../../shared/generated';
import { DispatchPage } from '../../shared/components/index';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatsApi } from '../../shared/services/ApiService';

/* TODO: implement this
const mapGameToRow = (game: Game): RowItem => {
  return {
  };
}; */
const mapChatToRow = (chat: Chat): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: chat.avatarId
        ? `${AVATAR_EP_URL}/${chat.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
    },
    url: `${CHAT_URL}/${chat.chatName}`,
    title: chat.chatName,
    subtitle: 'last message',
    key: chat.id,
  };
};

export default function ChatPage() {
  const getChats = useCallback(
    (requestParameters: ChatControllerGetChatsRequest) =>
      chatsApi.chatControllerGetChats(requestParameters),
    [],
  );
  const navigate = useNavigate();

  return (
    <DispatchPage
      dataValidator={instanceOfChat}
      fetchFn={getChats}
      dataMapper={mapChatToRow}
      button={
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={(): void => {
            window.location.replace(CREATE_CHAT_URL);
          }}
        >
          Add Chat
        </Button>
      }
    />
  );
}
