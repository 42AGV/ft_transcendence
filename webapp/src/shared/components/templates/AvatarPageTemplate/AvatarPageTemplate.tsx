import './AvatarPageTemplate.css';
import {
  Button,
  ButtonProps,
  Header,
  IconVariant,
  LargeAvatar,
  LargeAvatarProps,
  Loading,
  StatusVariant,
} from '../../index';
import { useNavigation } from '../../../hooks/UseNavigation';
import NotFoundPage from '../../../../pages/NotFoundPage/NotFoundPage';

type AvatarPageTemplateProps = {
  isLoading: boolean;
  isNotFound: boolean;
  headerStatusVariant?: StatusVariant;
  title: string;
  avatarProps: LargeAvatarProps;
  children: JSX.Element;
  button?: ButtonProps;
};

export default function AvatarPageTemplate({
  isLoading,
  avatarProps,
  children,
  button,
  title,
  headerStatusVariant,
  isNotFound,
}: AvatarPageTemplateProps) {
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

  if (isNotFound) {
    return <NotFoundPage />;
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
        <div className="generic-content-wrapper">{children}</div>
      </div>
      {button && <Button {...button} />}
    </div>
  );
}
