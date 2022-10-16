import './CreateChatPage.css';
import {
  Header,
  IconVariant,
  Input,
  InputVariant,
  LargeAvatar,
  RowItem,
  RowsList,
} from '../../shared/components';
import {
  AVATAR_EP_URL,
  EDIT_AVATAR_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { goBack } from '../../shared/callbacks';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User } from '../../shared/generated';

export default function CreateChatPage() {
  const [chatName, setChatName] = useState('');
  const navigate = useNavigate();
  const mapDataToRows = (
    callBack: (data: User) => RowItem,
    data: User[],
  ): RowItem[] => {
    return data.map((item) => callBack(item));
  };
  const mapUserToRow = (user: User): RowItem => {
    return {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: user.avatarId
          ? `${AVATAR_EP_URL}/${user.avatarId}`
          : WILDCARD_AVATAR_URL,
        status: 'offline',
        XCoordinate: user.avatarX,
        YCoordinate: user.avatarY,
      },
      url: `${USERS_URL}/${user.id}`,
      title: user.username,
      subtitle: 'level x',
      key: user.id,
    };
  };
  return (
    <div className="create-chat-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack(navigate)}>
        add chat
      </Header>
      <div className="create-chat-page-avatar">
        <LargeAvatar url={WILDCARD_AVATAR_URL} editUrl={EDIT_AVATAR_URL} />
      </div>
      <div className="create-chat-page-input-name">
        <Input
          variant={InputVariant.LIGHT}
          iconVariant={IconVariant.CHAT}
          value={chatName}
          label="Chat Name:"
          name="chatName"
          placeholder="chat name"
          onChange={(e) => setChatName(e.target.value)}
        />
      </div>
      <div className="create-chat-page-row">
        <Link
          className={`row paragraph-regular`}
          to={EDIT_AVATAR_URL}
          style={{
            cursor: 'pointer',
          }}
        >
          add users
        </Link>
      </div>
    </div>
  );
}
