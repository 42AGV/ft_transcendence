import {
  Button,
  ButtonVariant,
  IconVariant,
  RowItem,
  RowsTemplate,
} from '../../shared/components';
import {
  AVATAR_EP_URL,
  CHATROOM_URL,
  CHAT_URL,
  CREATE_CHATROOM_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Chat, ChatControllerGetChatsRequest } from '../../shared/generated';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatsApi } from '../../shared/services/ApiService';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import './ChatPage.css';

const ENTRIES_LIMIT = 15;
const mapChatToRow = (chat: Chat): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: chat.avatarId
        ? `${AVATAR_EP_URL}/${chat.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
    },
    url: `${CHATROOM_URL}/${chat.chatName}`,
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
          add chat
        </Button>
      </div>
    </div>
  );
}
