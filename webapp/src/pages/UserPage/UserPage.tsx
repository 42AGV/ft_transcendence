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
  EDIT_USER_URL,
  WILDCARD_AVATAR_URL,
  AVATAR_EP_URL,
} from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { usersApi } from '../../shared/services/ApiService';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { ResponseError, User } from '../../shared/generated';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

type UserPageProps = {
  displayAsAuthUser?: boolean;
};

type UserComponentTemplateProps = {
  user: User | null;
  displayAsAuthUser: boolean;
  isLoading: boolean;
};

const UserComponentTemplate = ({
  user,
  displayAsAuthUser,
  isLoading,
}: UserComponentTemplateProps) => {
  const { goBack } = useNavigation();
  const { logout, authUser } = useAuth();
  const isAuthUser =
    authUser !== null && user !== null && authUser.id === user.id;
  const [isBlocked, setIsBlocked] = useState(false);
  const getBlockStatus = useCallback(
    () =>
      isAuthUser || user === null
        ? Promise.resolve()
        : usersApi
            .userControllerGetBlock({ userId: user.id })
            .then(() => setIsBlocked(true))
            .catch((error) => {
              if (
                error instanceof ResponseError &&
                error.response.status === 404
              ) {
                setIsBlocked(false);
              } else {
                throw error;
              }
            }),
    [isAuthUser, user],
  );
  const { isLoading: isBlockStatusLoading } = useData(getBlockStatus);

  const blockUser = async () => {
    if (!isAuthUser && user) {
      try {
        await usersApi.userControllerBlockUser({ userId: user.id });
        setIsBlocked(true);
      } catch (error) {
        if (error instanceof ResponseError && error.response.status === 422) {
          setIsBlocked(true);
        } else {
          console.error(error);
        }
      }
    }
  };

  const unblockUser = async () => {
    if (!isAuthUser && user) {
      try {
        await usersApi.userControllerUnblockUser({ userId: user.id });
        setIsBlocked(false);
      } catch (error) {
        if (error instanceof ResponseError && error.response.status === 404) {
          setIsBlocked(false);
        } else {
          console.error(error);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="user-page">
        <div className="user-page-loading">
          <Loading />
        </div>
      </div>
    );
  }

  const unblockUserButton = (
    <Button variant={ButtonVariant.SUBMIT} onClick={unblockUser}>
      Unblock
    </Button>
  );

  const blockUserButton = (
    <Button variant={ButtonVariant.WARNING} onClick={blockUser}>
      Block
    </Button>
  );

  const changeBlockStatusButton = () =>
    isBlocked ? unblockUserButton : blockUserButton;

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
      {!isAuthUser && !isBlockStatusLoading && changeBlockStatusButton()}
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
