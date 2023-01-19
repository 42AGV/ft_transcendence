import { IconVariant } from '../../shared/components';
import { ADMIN_URL, CHATS_URL } from '../../shared/urls';
import { ChatControllerGetChatroomsRequest } from '../../shared/generated';
import { useCallback } from 'react';
import { chatApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';
import ChatsPageTemplate from './template/ChatsPageTemplate';
import { useLocation } from 'react-router-dom';

export default function DiscoverChatsPage() {
  const { pathname } = useLocation();
  const overridePermissions = pathname.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const getChats = useCallback(
    (requestParameters: ChatControllerGetChatroomsRequest) =>
      chatApi.chatControllerGetChatrooms({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );
  return (
    <ChatsPageTemplate
      fetchFn={getChats}
      buttonIconVariant={IconVariant.ARROW_BACK}
      buttonLabel={`${overridePermissions ? 'Admin users' : 'chat'}`}
      buttonUrl={`${overridePermissions ? ADMIN_URL : CHATS_URL}`}
    />
  );
}
