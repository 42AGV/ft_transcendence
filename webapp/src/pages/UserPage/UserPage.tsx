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
  ToggleSwitch,
} from '../../shared/components';
import { EDIT_USER_URL, AVATAR_EP_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { usersApi } from '../../shared/services/ApiService';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { UserDto } from '../../shared/generated';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useBlock } from '../../shared/hooks/UseBlock';

type UserPageProps = {
  displayAsAuthUser?: boolean;
};

type UserComponentTemplateProps = {
  user: UserDto | null;
  displayAsAuthUser: boolean;
  isLoading: boolean;
};

const UserComponentTemplate = ({
  user,
  displayAsAuthUser,
  isLoading,
}: UserComponentTemplateProps) => {
  const { goBack } = useNavigation();
  const { logout } = useAuth();
  const { isBlocked, unblockUser, blockUser } = useBlock(user);

  if (isLoading) {
    return (
      <div className="user-page">
        <div className="user-page-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return user === null ? (
    <NotFoundPage />
  ) : (
    <div className="user-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="online"
      >
        {user.username}
      </Header>
      <div className="user-wrapper">
        <LargeAvatar
          url={`${AVATAR_EP_URL}/${user.avatarId}`}
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
        <div className="user-block-status-toggle">
          {isBlocked !== null && (
            <ToggleSwitch
              label={isBlocked ? 'Unblock' : 'Block'}
              isToggled={isBlocked ?? false}
              onToggle={isBlocked ? unblockUser : blockUser}
            />
          )}
        </div>
        {displayAsAuthUser && (
          <Row
            iconVariant={IconVariant.USERS}
            url={EDIT_USER_URL}
            title="Edit profile"
          />
        )}
      </div>
      {displayAsAuthUser && (
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

const AuthUserComponent = () => {
  const { authUser, isLoading } = useAuth();

  return UserComponentTemplate({
    user: authUser,
    displayAsAuthUser: true,
    isLoading,
  });
};

const UserComponent = () => {
  const { username } = useParams();

  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading } = useData(getUserByUserName);

  return UserComponentTemplate({ user, displayAsAuthUser: false, isLoading });
};

export default function UserPage({ displayAsAuthUser = false }: UserPageProps) {
  return displayAsAuthUser ? AuthUserComponent() : UserComponent();
}
