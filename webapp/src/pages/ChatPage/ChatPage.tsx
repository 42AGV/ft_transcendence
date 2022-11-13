import {
  Button,
  ButtonVariant,
  IconVariant,
  RowItem,
  MainTabTemplate,
  ButtonSize,
} from '../../shared/components';
import {
  AVATAR_EP_URL,
  CHATROOM_URL,
  CREATE_CHATROOM_URL,
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
import { useMediaQuery } from '../../shared/hooks/UseMediaQuery';

const mapChatToRow = (chatroom: Chatroom): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: `${AVATAR_EP_URL}/${chatroom.avatarId}`,
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
  const windowIsBig = useMediaQuery(768);
  const addChatButton = {
    buttonSize: windowIsBig ? ButtonSize.LARGE : ButtonSize.SMALL,
    variant: ButtonVariant.SUBMIT,
    onClick: () => navigate(CREATE_CHATROOM_URL),
    iconVariant: IconVariant.ADD,
  };
  const discoverChatButton = {
    buttonSize: windowIsBig ? ButtonSize.LARGE : ButtonSize.SMALL,
    variant: ButtonVariant.SUBMIT,
    onClick: () => navigate(`${CHATROOM_URL}/discover`),
    iconVariant: IconVariant.ARROW_FORWARD,
  };

  return (
    <div className="chat-page">
      <div className="chat-page-content">
        <SearchContextProvider fetchFn={getChats} maxEntries={ENTRIES_LIMIT}>
          <MainTabTemplate dataMapper={mapChatToRow} />
        </SearchContextProvider>
      </div>
      <div className="chat-page-button">
        <Button {...addChatButton}>add chatroom</Button>
        <Button {...discoverChatButton}>discover chatrooms</Button>
      </div>
    </div>
  );
}
