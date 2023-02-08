import { ReactNode } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../../../shared/components';
import { DEFAULT_LOGIN_REDIRECT_URL, HOST_URL } from '../../../urls';
import './LandingAnimationPageTemplate.css';
import { useAuth } from '../../../hooks/UseAuth';

type LandingAnimationPageTemplateProps = {
  children: ReactNode;
};

export default function LandingAnimationPageTemplate({
  children,
}: LandingAnimationPageTemplateProps) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={DEFAULT_LOGIN_REDIRECT_URL} replace />;
  }

  return (
    <div className="landing-animation-page">
      <Link className="landing-animation-page-title" to={HOST_URL}>
        <Text
          variant={TextVariant.TITLE}
          color={TextColor.GAME}
          weight={TextWeight.BOLD}
        >
          PONG
        </Text>
      </Link>
      <div className="landing-animation">
        <div className="landing-animation-ping"></div>
        <div className="landing-animation-pong"></div>
        <div className="landing-animation-ball"></div>
      </div>
      <div className="animation-template-container">{children}</div>
    </div>
  );
}
