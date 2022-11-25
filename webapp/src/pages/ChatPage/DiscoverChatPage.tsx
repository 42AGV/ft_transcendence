import { IconVariant } from '../../shared/components';
import { CHAT_URL } from '../../shared/urls';
import { ChatControllerGetChatroomsRequest } from '../../shared/generated';
import { useCallback } from 'react';
import { chatApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';
import ChatPageTemplate from './template/ChatPageTemplate';

export default function DiscoverChatPage() {
  const getChats = useCallback(
    (requestParameters: ChatControllerGetChatroomsRequest) =>
      chatApi.chatControllerGetChatrooms({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );
  return (
    <ChatPageTemplate
      fetchFn={getChats}
      buttonIconVariant={IconVariant.ARROW_BACK}
      buttonLabel="Chat"
      buttonUrl={CHAT_URL}
    />
  );
}
