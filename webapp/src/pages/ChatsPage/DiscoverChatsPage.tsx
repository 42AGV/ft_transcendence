import { IconVariant } from '../../shared/components';
import { CHATS_URL } from '../../shared/urls';
import { ChatControllerGetChatroomsRequest } from '../../shared/generated';
import { useCallback } from 'react';
import { chatApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';
import ChatsPageTemplate from './template/ChatsPageTemplate';

export default function DiscoverChatsPage() {
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
      buttonLabel="Chat"
      buttonUrl={CHATS_URL}
    />
  );
}
