import { Navigate, useNavigate } from 'react-router-dom';
import { LoadingPage } from '..';
import {
  Button,
  ButtonVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import {
  DEFAULT_LOGIN_REDIRECT_URL,
  LOGIN_OPTIONS_URL,
  REGISTER_URL,
} from '../../shared/urls';
import './LandingPage.css';

export default function Landing() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={DEFAULT_LOGIN_REDIRECT_URL} replace />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="landing">
      <div className="landing-title">
        <Text
          variant={TextVariant.TITLE}
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
      <div className="landing-buttons">
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => navigate(REGISTER_URL)}
        >
          Create new account
        </Button>
        <Button
          variant={ButtonVariant.ALTERNATIVE}
          onClick={() => navigate(LOGIN_OPTIONS_URL)}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
