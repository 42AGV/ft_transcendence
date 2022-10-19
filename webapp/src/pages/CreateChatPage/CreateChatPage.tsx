import './CreateChatPage.css';
import {
  Button,
  ButtonVariant,
  Header,
  Icon,
  IconSize,
  IconVariant,
  MediumAvatar,
  RowItem,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import {
  AVATAR_EP_URL,
  CREATE_CHAT_URL,
  EDIT_AVATAR_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User } from '../../shared/generated';
import { Color } from '../../shared/types';
import { useNavigation } from '../../shared/hooks/UseNavigation';

export default function CreateChatPage() {
  const [chatName, setChatName] = useState('');
  const navigate = useNavigate();
  const { goBack } = useNavigation();
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
      url: `${USERS_URL}/${user.username}`,
      title: user.username,
      subtitle: 'level x',
      key: user.id,
    };
  };
  const RowChildren: JSX.Element = (
    <>
      <div className="row-icon">
        <Icon
          variant={IconVariant.ADD}
          size={IconSize.SMALL}
          color={Color.LIGHT}
        />
      </div>
      <h4>add users</h4>
    </>
  );
  return (
    <div className="create-chat-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack()}>
        add chat
      </Header>
      <div className="create-chat-page-avatar-properties">
        <div className="create-chat-page-avatar">
          <MediumAvatar url={WILDCARD_AVATAR_URL} />
        </div>
        <div className="create-chat-page-properties">
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
          >
            chat name
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
          >
            public channel
          </Text>
        </div>
      </div>
      <div className="create-chat-page-row">
        <Link
          className={`row paragraph-regular`}
          to={EDIT_AVATAR_URL}
          style={{
            cursor: 'pointer',
          }}
        >
          {RowChildren}
        </Link>
      </div>
      <div className="create-chat-page-buttons">
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => navigate(CREATE_CHAT_URL)}
        >
          advanced options
        </Button>
      </div>
    </div>
  );
}
