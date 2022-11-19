import './EditChatroomMemberPage.css';
import {
  Button,
  ButtonProps,
  ButtonVariant,
  Header,
  IconVariant,
  LargeAvatar,
  Loading,
  Row,
  StatusVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { LargeAvatarProps } from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { AVATAR_EP_URL, EDIT_USER_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';

type AvatarPageTemplateProps = {
  isLoading: boolean;
  headerStatusVariant?: StatusVariant;
  title: string;
  avatarProps: LargeAvatarProps;
  content: JSX.Element;
  button?: ButtonProps;
};

function EditChatroomMemberPageHelper({
  isLoading,
  avatarProps,
  content,
  button,
  title,
  headerStatusVariant,
}: AvatarPageTemplateProps) {
  const { chatroomId, username } = useParams();
  console.log(`${chatroomId}, ${username}`);
  const { goBack } = useNavigation();

  if (isLoading) {
    return (
      <div className="avatar-page-template">
        <div className="avatar-page-template-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="avatar-page-template">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant={headerStatusVariant}
      >
        {title}
      </Header>
      <div className="center-element-wrapper">
        <LargeAvatar {...avatarProps} />
        <div className="generic-content-wrapper">{content}</div>
      </div>
      {button && <Button {...button} />}
    </div>
  );
}

export default function EditChatroomMemberPage() {
  const { authUser, logout, isLoading: isAuthUserLoading } = useAuth();
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
    isLoading: isAuthUserLoading,
    headerStatusVariant: 'online',
    title: authUser?.username ?? '',
    avatarProps: {
      url: `${AVATAR_EP_URL}/${authUser?.avatarId}`,
      caption: 'level 4',
      XCoordinate: authUser?.avatarX,
      YCoordinate: authUser?.avatarY,
    },
    content: (
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
    ),
    button: {
      variant: ButtonVariant.WARNING,
      iconVariant: IconVariant.LOGOUT,
      onClick: logout,
      children: 'Logout',
    },
  };
  return EditChatroomMemberPageHelper(param);
}
