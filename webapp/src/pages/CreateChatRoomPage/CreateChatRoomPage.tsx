import {
  Button,
  ButtonVariant,
  Header,
  Icon,
  IconSize,
  IconVariant,
  MediumAvatar,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { CREATE_CHATROOM_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { Link, useNavigate } from 'react-router-dom';
import { Color } from '../../shared/types';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import './CreateChatRoomPage.css';

export default function CreateChatRoomPage() {
  const navigate = useNavigate();
  const { goBack } = useNavigation();

  const RowChildren: JSX.Element = (
    <>
      <div className="row-icon">
        <Icon
          variant={IconVariant.ADD}
          size={IconSize.SMALL}
          color={Color.LIGHT}
        />
      </div>
      <Text
        variant={TextVariant.PARAGRAPH}
        color={TextColor.LIGHT}
        weight={TextWeight.REGULAR}
      >
        add users
      </Text>
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
          to={CREATE_CHATROOM_URL}
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
          onClick={() => navigate(CREATE_CHATROOM_URL)}
        >
          advanced options
        </Button>
      </div>
    </div>
  );
}
