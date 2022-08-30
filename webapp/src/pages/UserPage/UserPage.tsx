import './UserPage.css';
import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  LargeAvatar,
  Loading,
  Row,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { USER_URL, USERS_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { goBack } from '../../shared/callbacks';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { usersApi } from '../../shared/services/ApiService';

type UserPageProps = {
  isMe: boolean;
};

export default function UserPage({ isMe = false }: UserPageProps) {
  const param = useParams();
  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const getUserById = useCallback(
    () => usersApi.userControllerGetUserById({ uuid: param.id! }),
    [param.id],
  );
  const { data: user } = useData(isMe ? getCurrentUser : getUserById);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return user === null ? (
    <div className="user-page">
      <div className="user-page-loading">
        <Loading />
      </div>
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
            {user.fullName}
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
            iconVariant={IconVariant.USERS}
            url={USER_URL + '/edit'}
            title="Edit profile"
          />
        )}
      </div>
      {isMe && (
        <Button
          variant={ButtonVariant.WARNING}
          iconVariant={IconVariant.LOGOUT}
          onClick={logout}
        >
          Logout
        </Button>
      )}
    </div>
  );
}
