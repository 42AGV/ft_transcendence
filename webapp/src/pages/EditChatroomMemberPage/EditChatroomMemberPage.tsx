import './EditChatroomMemberPage.css';
import {
  Button,
  ButtonProps,
  ButtonVariant,
  Header,
  HeaderProps,
  IconVariant,
  LargeAvatar,
  Loading,
  Row,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { LargeAvatarProps } from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { AVATAR_EP_URL, EDIT_USER_URL } from '../../shared/urls';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useParams } from 'react-router-dom';

type AvatarPageTemplateProps = {
  avatarProps?: LargeAvatarProps;
  elements?: JSX.Element[];
  button?: ButtonProps;
  header?: HeaderProps;
};

function EditChatroomMemberPageHelper({
  avatarProps,
  elements,
  button,
  header,
}: AvatarPageTemplateProps) {
  const { chatroomId, username } = useParams();
  console.log(`${chatroomId}, ${username}`);
  const { goBack } = useNavigation();
  const { isLoading, authUser } = useAuth();

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
    <div className="avatar-page-template">
      {(header && <Header {...header}>{header.children[0]}</Header>) || (
        <Header
          icon={IconVariant.ARROW_BACK}
          onClick={goBack}
          statusVariant="online"
        >
          {authUser.username}
        </Header>
      )}
      <div className="center-element-wrapper">
        {(avatarProps && <LargeAvatar {...avatarProps} />) || (
          <LargeAvatar
            url={`${AVATAR_EP_URL}/${authUser.avatarId}`}
            caption="level 4"
            XCoordinate={authUser.avatarX}
            YCoordinate={authUser.avatarY}
          />
        )}
        <div className="generic-content-wrapper">{elements && elements}</div>
      </div>
      {button && <Button {...button} />}
    </div>
  );
}

export default function EditChatroomMemberPage() {
  const { authUser, logout, isLoading: isAuthUserLoading } = useAuth();
  const { goBack } = useNavigation();
  const content = [
    <Text
      key="0"
      variant={TextVariant.PARAGRAPH}
      color={TextColor.LIGHT}
      weight={TextWeight.MEDIUM}
    >
      {authUser?.fullName ?? ''}
    </Text>,
    <Text
      key="1"
      variant={TextVariant.PARAGRAPH}
      color={TextColor.LIGHT}
      weight={TextWeight.MEDIUM}
    >
      {authUser?.email ?? ''}
    </Text>,
    <Row
      key="2"
      iconVariant={IconVariant.USERS}
      url={EDIT_USER_URL}
      title="Edit profile"
    />,
  ];
  if (isAuthUserLoading) {
    return (
      <div className="auth-user-page">
        <div className="auth-user-page-loading">
          <Loading />
        </div>
      </div>
    );
  }
  const param: AvatarPageTemplateProps = {
    avatarProps: {
      url: `${AVATAR_EP_URL}/${authUser?.avatarId}`,
      caption: 'level 4',
      XCoordinate: authUser?.avatarX,
      YCoordinate: authUser?.avatarY,
    },
    button: {
      variant: ButtonVariant.WARNING,
      iconVariant: IconVariant.LOGOUT,
      onClick: logout,
      children: 'Logout',
    },
    header: {
      icon: IconVariant.ARROW_BACK,
      onClick: goBack,
      statusVariant: 'online',
      children: authUser?.username ?? '',
    },
    elements: content,
  };
  return EditChatroomMemberPageHelper(param);
}
