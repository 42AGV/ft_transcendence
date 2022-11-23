import {
  AvatarPageTemplate,
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
import { AVATAR_EP_URL, EDIT_USER_URL } from '../../shared/urls';

export default function AuthUserPage() {
  const { authUser, logout, isLoading: isAuthUserLoading } = useAuth();
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
        </>
      </AvatarPageTemplate>
    </div>
  );
}
