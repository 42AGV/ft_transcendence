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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
  const [me, setMe] = useState<User | null>(null);
  const result: User | null = useData<User>(USERS_EP_URL + '/me');
  const navigate = useNavigate();

  useEffect(() => {
    if (result && instanceOfUser(result)) {
      setMe(result);
    }
  }, [result]);

  return me === null ? (
    <div className="user-page">
      <Text variant={TextVariant.SUBHEADING} weight={TextWeight.MEDIUM}>
        Loading...
      </Text>
    </div>
  ) : (
    <div className="user-page">
      <Header
        navigationFigure={IconVariant.ARROW_BACK}
        onClick={goBack(navigate)}
        statusVariant="online"
      >
        {me.username}
      </Header>
      <div className="user-wrapper">
        <LargeAvatar
          url={
            me.avatarId
              ? `${USERS_EP_URL}/${me.id}/avatar`
              : WILDCARD_AVATAR_URL
          }
          caption="level 4"
        />
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
            {me.email}
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
        onClick={logout(navigate)}
      >
        Logout
      </Button>
    </div>
  );
}
