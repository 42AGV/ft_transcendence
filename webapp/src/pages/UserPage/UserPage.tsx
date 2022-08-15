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
import { useNavigate, useParams } from 'react-router-dom';

type UserPageProps = {
  isMe: boolean;
};

export default function UserPage({ isMe = false }: UserPageProps) {
  const param = useParams();
  const [user, setUser] = useState<User | null>(null);
  const result: User | null = useData<User>(
    isMe ? `${USERS_EP_URL}/me` : `${USERS_EP_URL}/${param.id}`,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (result && instanceOfUser(result)) {
      setUser(result);
    }
  }, [result]);

  return user === null ? (
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
        {user.username}
      </Header>
      <div className="user-wrapper">
        <LargeAvatar
          url={
            user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
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
            {user.username}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            {user.email}
          </Text>
        </div>
        {isMe && (
          <Row
            iconVariant={IconVariant.EDIT}
            url={USER_URL + '/edit'}
            title="Edit profile"
          />
        )}
      </div>
      {isMe && (
        <Button
          variant={ButtonVariant.WARNING}
          iconVariant={IconVariant.LOGOUT}
          onClick={logout(navigate)}
        >
          Logout
        </Button>
      )}
    </div>
  );
}
