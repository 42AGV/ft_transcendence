import './UserPage.css';
import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  LargeAvatar,
  Row,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import {
  API_LOGOUT_EP,
  HOST_URL,
  USER_URL,
  USERS_EP_URL,
} from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';

interface User {
  readonly username: string;
  readonly email: string;
  readonly avatarId: string | null;
  readonly id: string;
  readonly createdAt: Date;
}

export default function UserPage() {
  const me =
    useData(USERS_EP_URL + '/me') ??
    ({
      username: '',
      email: '',
      avatarId: null,
      id: '',
      createdAt: new Date(),
    } as User);

  const logout = () => {
    fetch(API_LOGOUT_EP, {
      method: 'DELETE',
    })
      .catch((e) => console.error(e))
      .finally(() => {
        window.location.href = HOST_URL;
      });
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="user-page">
      <Header
        navigationFigure={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="online"
      >
        {me.username}
      </Header>
      <div className="user-page-avatar">
        {me.id && me.id !== '' ? (
          <LargeAvatar
            url={`${USERS_EP_URL}/${me.id}/avatar`}
            caption="level 4"
          />
        ) : (
          <></>
        )}
      </div>
      <Text
        variant={TextVariant.PARAGRAPH}
        color={TextColor.LIGHT}
        weight={TextWeight.MEDIUM}
      >
        {me.username}
      </Text>
      <Text
        variant={TextVariant.PARAGRAPH}
        color={TextColor.LIGHT}
        weight={TextWeight.MEDIUM}
      >
        wcroix@fuckingawesome.com
      </Text>
      <Row
        iconVariant={IconVariant.EDIT}
        url={USER_URL + '/edit'}
        title="Edit profile"
      />
      <Button
        variant={ButtonVariant.WARNING}
        iconVariant={IconVariant.LOGOUT}
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}
