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
  CREATE_CHATROOM_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import {
  ChatControllerGetChatRoomsRequest,
  ChatRoom,
} from '../../shared/generated';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import './ChatPage.css';
import { chatApi } from '../../shared/services/ApiService';

const ENTRIES_LIMIT = 15;
const mapChatToRow = (chatRoom: ChatRoom): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: chatRoom.avatarId
        ? `${AVATAR_EP_URL}/${chatRoom.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
    },
    url: `${CHATROOM_URL}/${chatRoom.name}`,
    title: chatRoom.name,
    subtitle: 'last message',
    key: chatRoom.id,
  };
};

export default function ChatPage() {
  const getChats = useCallback(
    (requestParameters: ChatControllerGetChatRoomsRequest) =>
      chatApi.chatControllerGetChatRooms(requestParameters),
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
