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
  CHATROOM_URL,
  CREATE_CHATROOM_URL,
} from '../../../shared/urls';
import { Chatroom } from '../../../shared/generated';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { SearchContextProvider } from '../../../shared/context/SearchContext';
import { ENTRIES_LIMIT } from '../../../shared/constants';
import { Query } from '../../../shared/types';

type ChatPageTemplateProps = {
  fetchFn: <RequestType extends Query>(
    requestParams: RequestType,
  ) => Promise<Chatroom[]>;
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
  const navigate = useNavigate();
  const overridePermissions =
    buttonUrl.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const mapChatToRow = (chatroom: Chatroom): RowItem => {
    return {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: `${AVATAR_EP_URL}/${chatroom.avatarId}`,
      },
      url: `${overridePermissions ? ADMIN_URL : ''}${CHATROOM_URL}/${
        chatroom.id
      }`,
      title: chatroom.name,
      subtitle: 'last message',
      key: chatroom.id,
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
