import {
  ButtonVariant,
  IconVariant,
  RowItem,
  MainTabTemplate,
  ButtonProps,
} from '../../../shared/components';
import {
  ADMIN_URL,
  AVATAR_EP_URL,
  CHAT_URL,
  CHATROOM_URL,
  CREATE_CHATROOM_URL,
} from '../../../shared/urls';
import {
  GenericChat,
  GenericChatChatTypeEnum,
} from '../../../shared/generated';
import { useNavigate } from 'react-router-dom';
import { SearchContextProvider } from '../../../shared/context/SearchContext';
import { ENTRIES_LIMIT } from '../../../shared/constants';
import { Query } from '../../../shared/types';
import { useFriend } from '../../../shared/hooks/UseFriend';
import { useUserStatus } from '../../../shared/hooks/UseUserStatus';

type ChatPageTemplateProps = {
  fetchFn: <RequestType extends Query>(
    requestParams: RequestType,
  ) => Promise<GenericChat[]>;
  buttonUrl: string;
  buttonIconVariant: IconVariant;
  buttonLabel: string;
};

export default function ChatsPageTemplate({
  fetchFn,
  buttonUrl,
  buttonIconVariant,
  buttonLabel,
}: ChatPageTemplateProps) {
  const { userStatus } = useUserStatus();
  const { userFriends } = useFriend();
  const navigate = useNavigate();
  const overridePermissions =
    buttonUrl.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const mapChatToRow = (chatroom: GenericChat): RowItem => {
    return {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${chatroom.avatarId}`,
        XCoordinate: chatroom.avatarX,
        YCoordinate: chatroom.avatarY,
        status:
          chatroom.chatType === GenericChatChatTypeEnum.OneToOne &&
          userFriends(chatroom.id)
            ? userStatus(chatroom.id)
            : undefined,
      },
      url: `${overridePermissions ? ADMIN_URL : ''}${
        chatroom.chatType === GenericChatChatTypeEnum.OneToOne
          ? `${CHAT_URL}/${chatroom.name}`
          : `${CHATROOM_URL}/${chatroom.id}`
      }`,
      title: chatroom.name,
      subtitle: chatroom.lastMsgSenderUsername
        ? `${chatroom.lastMsgSenderUsername}: ${chatroom.lastMessage}`
        : `${chatroom.isPublic ? 'public' : 'private'}`,
      key: chatroom.id,
      altText: `${chatroom.lastMessageDate}`,
    };
  };
  let chatButtons: ButtonProps[] = [
    {
      variant: ButtonVariant.SUBMIT,
      onClick: () => navigate(buttonUrl),
      iconVariant: buttonIconVariant,
      children: buttonLabel,
    },
  ];
  if (!overridePermissions) {
    chatButtons.unshift({
      variant: ButtonVariant.SUBMIT,
      onClick: () => navigate(CREATE_CHATROOM_URL),
      iconVariant: IconVariant.ADD,
      children: 'Add chatroom',
    });
  }
  return (
    <div className="chat-page">
      <div className="chat-page-content">
        <SearchContextProvider fetchFn={fetchFn} maxEntries={ENTRIES_LIMIT}>
          <MainTabTemplate dataMapper={mapChatToRow} buttons={chatButtons} />
        </SearchContextProvider>
      </div>
    </div>
  );
}
