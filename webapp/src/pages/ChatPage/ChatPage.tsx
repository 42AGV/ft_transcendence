import { IconVariant } from '../../shared/components';
import { CHAT_URL } from '../../shared/urls';
import { ChatControllerGetAuthChatroomsRequest } from '../../shared/generated';
import { useCallback } from 'react';
import { chatApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';
import ChatPageTemplate from './template/ChatPageTemplate';

export default function ChatPage() {
  const getChats = useCallback(
    (requestParameters: ChatControllerGetAuthChatroomsRequest) =>
      chatApi.chatControllerGetAuthChatrooms({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );
  return (
    <ChatPageTemplate
      fetchFn={getChats}
      buttonIconVariant={IconVariant.ARROW_FORWARD}
      buttonLabel="Discover"
      buttonUrl={`${CHAT_URL}/discover`}
    />
  );
}
