import {
  AvatarPageTemplate,
  ButtonProps,
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
  USER_URL,
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
  const enableTwoFactorAuthButtonProps: ButtonProps = {
    variant: ButtonVariant.SUBMIT,
    onClick: () => navigate(TWO_FACTOR_AUTH_ENABLE_URL),
    children: 'Enable 2FA',
  };
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
  const disableTwoFactorAuthButtonProps: ButtonProps = {
    variant: ButtonVariant.WARNING,
    onClick: disableTwoFactorHandler,
    children: 'Disable 2FA',
  };

  return (
    <div className="auth-user-page">
      <AvatarPageTemplate
        isLoading={isAuthUserLoading}
        headerStatusVariant="online"
        title={authUser?.username ?? ''}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${authUser?.avatarId}`,
          caption: `level ${authUser?.level}`,
          XCoordinate: authUser?.avatarX,
          YCoordinate: authUser?.avatarY,
        }}
        button={{
          variant: ButtonVariant.WARNING,
          iconVariant: IconVariant.LOGOUT,
          onClick: logout,
          children: 'Logout',
        }}
        secondaryButton={
          authUser?.isTwoFactorAuthenticationEnabled
            ? disableTwoFactorAuthButtonProps
            : enableTwoFactorAuthButtonProps
        }
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
          <Row
            iconVariant={IconVariant.STATS}
            url={`${USER_URL}/${authUser?.username ?? ''}/history`}
            title={'Game history'}
          />
        </>
      </AvatarPageTemplate>
    </div>
  );
}
