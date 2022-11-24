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
  avatarProps?: LargeAvatarProps;
  children: JSX.Element;
  button?: ButtonProps;
  secondaryButton?: ButtonProps;
  captionLikeElement?: JSX.Element;
};

export default function AvatarPageTemplate({
  isLoading,
  avatarProps,
  children,
  button,
  secondaryButton,
  title,
  headerStatusVariant,
  isNotFound,
  captionLikeElement,
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
      <div className="avatar-page-center-element-wrapper">
        <div className="avatar-page-left-column">
          {avatarProps && <LargeAvatar {...avatarProps} />}
          <div className="avatar-page-caption-like-wrapper">
            {captionLikeElement && captionLikeElement}
          </div>
        </div>
        <div className="avatar-page-right-column">{children}</div>
      </div>
      <div className="avatar-page-buttons-wrapper">
        {button && <Button {...button} />}
        {secondaryButton && <Button {...secondaryButton} />}
      </div>
    </div>
  );
}
