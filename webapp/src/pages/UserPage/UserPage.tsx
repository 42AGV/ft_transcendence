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
import {
  USER_URL,
  WILDCARD_AVATAR_URL,
  AVATAR_EP_URL,
} from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { usersApi } from '../../shared/services/ApiService';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { User } from '../../shared/generated';

type UserComponentTemplateProps = {
  user: User | null;
  isAuthUser: boolean;
};

const UserComponentTemplate = ({
  user,
  isAuthUser,
}: UserComponentTemplateProps) => {
  const { goBack } = useNavigation();
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
        icon={IconVariant.ARROW_BACK}
        onClick={goBack()}
        statusVariant="online"
      >
        {user.username}
      </Header>
      <div className="user-wrapper">
        <LargeAvatar
          url={
            user.avatarId
              ? `${AVATAR_EP_URL}/${user.avatarId}`
              : WILDCARD_AVATAR_URL
          }
          caption="level 4"
          XCoordinate={user.avatarX}
          YCoordinate={user.avatarY}
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
        {isAuthUser && (
          <Row
            iconVariant={IconVariant.USERS}
            url={`${USER_URL}/${user.username}/edit`}
            title="Edit profile"
          />
        )}
      </div>
      {isAuthUser && (
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
};

const AuthUserComponent = (username?: string) => {
  const { authUser } = useAuth(username);

  return UserComponentTemplate({ user: authUser, isAuthUser: true });
};

const UserComponent = (username?: string) => {
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user } = useData(getUserByUserName);

  return UserComponentTemplate({ user, isAuthUser: false });
};

export default function UserPage() {
  const { username } = useParams();
  const { isMe } = useAuth(username);

  return isMe ? AuthUserComponent(username) : UserComponent(username);
}
