import {
  AvatarPageTemplate,
  ButtonVariant,
  IconVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { CHATROOM_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';

export default function EditChatroomMemberPage() {
  const { chatroomId, username } = useParams();

  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom, isLoading: isChatroomLoading } =
    useData<Chatroom>(getChatroom);
  console.log(username);

  return (
    <AvatarPageTemplate
      isLoading={isChatroomLoading}
      headerStatusVariant="online"
      title={chatroom?.name ?? ''}
      avatarProps={{
        url:
          // TODO: Remove the wildcard avatar when we implement #317
          chatroom?.avatarId
            ? `${CHATROOM_EP_URL}/${chatroomId}/avatars/${chatroom?.avatarId}`
            : WILDCARD_AVATAR_URL,
        XCoordinate: chatroom?.avatarX,
        YCoordinate: chatroom?.avatarY,
      }}
      button={{
        variant: ButtonVariant.WARNING,
        iconVariant: IconVariant.REMOVE,
        children: 'remove from chat',
      }}
    >
      <>
        <Text
          variant={TextVariant.PARAGRAPH}
          color={TextColor.LIGHT}
          weight={TextWeight.MEDIUM}
        >
          Test
        </Text>
      </>
    </AvatarPageTemplate>
  );
}
