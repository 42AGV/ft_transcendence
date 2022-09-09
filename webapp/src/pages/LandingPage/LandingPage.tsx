import { Link, Navigate } from 'react-router-dom';
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
import {
  DEFAULT_LOGIN_REDIRECT_URL,
  LOGIN_OPTIONS_URL,
  REGISTER_URL,
} from '../../shared/urls';
import './LandingPage.css';

type LocationState = {
  state: {
    from: Location;
  };
};

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (user) {
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
        <div className="landing-animation-ping"></div>
        <div className="landing-animation-pong"></div>
        <div className="landing-animation-ball"></div>
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
        <Link to={REGISTER_URL}>
          <Button variant={ButtonVariant.SUBMIT}>Create new account</Button>
        </Link>
        <Link to={LOGIN_OPTIONS_URL}>
          <Button variant={ButtonVariant.ALTERNATIVE}>Login</Button>
        </Link>
      </div>
    </div>
  );
}
