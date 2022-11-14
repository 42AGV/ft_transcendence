import {
  Button,
  ButtonVariant,
  IconVariant,
  RowItem,
  RowsTemplate,
} from '../../shared/components';
import {
  CHATROOM_EP_URL,
  CHATROOM_URL,
  CREATE_CHATROOM_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import {
  ChatControllerGetChatroomsRequest,
  Chatroom,
} from '../../shared/generated';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import './ChatPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';

const mapChatToRow = (chatroom: Chatroom): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      // TODO: Remove the wildcard avatar when we implement #317
      url: chatroom.avatarId
        ? `${CHATROOM_EP_URL}/${chatroom.id}/avatars/${chatroom.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
    },
    url: `${CHATROOM_URL}/${chatroom.id}`,
    title: chatroom.name,
    subtitle: 'last message',
    key: chatroom.id,
  };
};

export default function ChatPage() {
  const getChats = useCallback(
    (requestParameters: ChatControllerGetChatroomsRequest) =>
      chatApi.chatControllerGetChatrooms(requestParameters),
    [],
  );
  const navigate = useNavigate();

  return (
    <div className="chat-page">
      <div className="chat-page-content">
        <SearchContextProvider fetchFn={getChats} maxEntries={ENTRIES_LIMIT}>
          <RowsTemplate dataMapper={mapChatToRow} />
        </SearchContextProvider>
      </div>
      <div className="chat-page-button">
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => navigate(CREATE_CHATROOM_URL)}
          iconVariant={IconVariant.ADD}
        >
          add chatroom
        </Button>
      </div>
    </div>
  );
}
