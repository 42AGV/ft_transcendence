import './EditChatroomMemberPage.css';
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
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { AVATAR_EP_URL, EDIT_USER_URL } from '../../shared/urls';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useParams } from 'react-router-dom';

export default function EditChatroomMemberPage() {
  const { chatroomId, username } = useParams();
  console.log(`${chatroomId}, ${username}`);
  const { goBack, navigate } = useNavigation();
  const { isLoading, authUser, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-user-page">
        <div className="auth-user-page-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return authUser === null ? (
    <NotFoundPage />
  ) : (
    <div className="auth-user-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="online"
      >
        {authUser.username}
      </Header>
      <div className="auth-user-wrapper">
        <LargeAvatar
          url={`${AVATAR_EP_URL}/${authUser.avatarId}`}
          caption="level 4"
          XCoordinate={authUser.avatarX}
          YCoordinate={authUser.avatarY}
        />
        <div className="auth-user-text">
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            {authUser.fullName}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            {authUser.email}
          </Text>
        </div>
        <Row
          iconVariant={IconVariant.USERS}
          url={EDIT_USER_URL}
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
