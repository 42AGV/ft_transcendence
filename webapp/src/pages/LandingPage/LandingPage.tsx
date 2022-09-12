import { Navigate } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  Loading,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import { DEFAULT_LOGIN_REDIRECT_URL, LOGIN_EP_URL } from '../../shared/urls';
import './LandingPage.css';

export default function Landing() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={DEFAULT_LOGIN_REDIRECT_URL} replace />;
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="landing-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="landing">
      <div className="landing-title">
        <Text
          variant={TextVariant.SUBTITLE}
          color={TextColor.GAME}
          weight={TextWeight.BOLD}
        >
          PONG
        </Text>
      </div>
      <div className="landing-animation">
        <div className="landing-animation-ping" />
        <div className="landing-animation-pong" />
        <div className="landing-animation-ball" />
      </div>
      <div className="landing-subtitle">
        <Text
          variant={TextVariant.TITLE}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
        >
          Play online pong with your friends
        </Text>
      </div>
      <div className="landing-login-button">
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => window.location.replace(LOGIN_EP_URL)}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
