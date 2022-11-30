import { IconVariant } from '../../shared/components';
import { CHATS_URL } from '../../shared/urls';
import { ChatControllerGetAuthChatroomsRequest } from '../../shared/generated';
import { useCallback } from 'react';
import { chatApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';
import ChatsPageTemplate from './template/ChatsPageTemplate';

export default function ChatsPage() {
  const getChats = useCallback(
    (requestParameters: ChatControllerGetAuthChatroomsRequest) =>
      chatApi.chatControllerGetAuthChatrooms({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
      }),
    [],
  );
  return (
    <ChatsPageTemplate
      fetchFn={getChats}
      buttonIconVariant={IconVariant.ARROW_FORWARD}
      buttonLabel="Discover"
      buttonUrl={`${CHATS_URL}/discover`}
    />
  );
}
