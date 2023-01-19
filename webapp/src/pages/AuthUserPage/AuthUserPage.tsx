import {
  AvatarPageTemplate,
  Button,
  ButtonVariant,
  IconVariant,
  Row,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import './AuthUserPage.css';
import { useAuth } from '../../shared/hooks/UseAuth';
import {
  AVATAR_EP_URL,
  EDIT_USER_URL,
  TWO_FACTOR_AUTH_ENABLE_URL,
} from '../../shared/urls';
import { authApi } from '../../shared/services/ApiService';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../../shared/context/NotificationContext';

export default function AuthUserPage() {
  const {
    authUser,
    setAuthUser,
    logout,
    isLoading: isAuthUserLoading,
  } = useAuth();
  const navigate = useNavigate();
  const enableTwoFactorAuthButton = (
    <Button
      variant={ButtonVariant.SUBMIT}
      onClick={() => navigate(TWO_FACTOR_AUTH_ENABLE_URL)}
    >
      Enable 2FA
    </Button>
  );
  const { warn } = useNotificationContext();
  const disableTwoFactorHandler = async () => {
    if (!authUser) {
      return;
    }
    try {
      await authApi.authControllerDisableTwoFactorAuthentication();
      setAuthUser({ ...authUser, isTwoFactorAuthenticationEnabled: false });
    } catch (error) {
      warn('Service Unavailable');
    }
  };
  const disableTwoFactorAuthButton = (
    <Button variant={ButtonVariant.WARNING} onClick={disableTwoFactorHandler}>
      Disable 2FA
    </Button>
  );

  return (
    <div className="auth-user-page">
      <AvatarPageTemplate
        isLoading={isAuthUserLoading}
        headerStatusVariant="online"
        title={authUser?.username ?? ''}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${authUser?.avatarId}`,
          caption: 'level 4',
          XCoordinate: authUser?.avatarX,
          YCoordinate: authUser?.avatarY,
        }}
        button={{
          variant: ButtonVariant.WARNING,
          iconVariant: IconVariant.LOGOUT,
          onClick: logout,
          children: 'Logout',
        }}
        isNotFound={authUser === null}
      >
        <>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {authUser?.fullName ?? ''}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {authUser?.email ?? ''}
          </Text>
          <Row
            iconVariant={IconVariant.USERS}
            url={EDIT_USER_URL}
            title="Edit profile"
          />
          {authUser?.isTwoFactorAuthenticationEnabled
            ? disableTwoFactorAuthButton
            : enableTwoFactorAuthButton}
        </>
      </AvatarPageTemplate>
    </div>
  );
}
