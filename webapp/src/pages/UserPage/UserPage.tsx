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
import { USER_URL, USERS_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { instanceOfUser, User } from '../../shared/types';
import { useData } from '../../shared/hooks/UseData';
import { goBack, logout } from '../../shared/callbacks';

export default function UserPage() {
  const me = useData<User>(
    USERS_EP_URL + '/me',
    {
      username: 'placeholder-name',
      email: '',
      avatarId: null,
      id: '',
      createdAt: new Date(Date.now()),
    },
    instanceOfUser,
  );

  return (
    <div className="user-page">
      <Header
        navigationFigure={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="online"
      >
        {me.username}
      </Header>
      <div className="user-wrapper">
        {me.id ? (
          <LargeAvatar
            url={
              me.id !== ''
                ? `${USERS_EP_URL}/${me.id}/avatar`
                : WILDCARD_AVATAR_URL
            }
            caption="level 4"
          />
        ) : (
          <></>
        )}
        <div className="user-text">
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            {me.username}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            wcroix@fuckingawesome.com
          </Text>
        </div>
        <Row
          iconVariant={IconVariant.EDIT}
          url={USER_URL + '/edit'}
          title="Edit profile"
        />
      </div>
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
