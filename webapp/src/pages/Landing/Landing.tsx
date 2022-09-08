import { useLocation } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { DEFAULT_LOGIN_REDIRECT_URL, LOGIN_EP_URL } from '../../shared/urls';
import './Landing.css';

type LocationState = {
  state: {
    from: Location;
  };
};

export default function Landing() {
  const location = useLocation() as LocationState;
  const from = location.state?.from?.pathname || DEFAULT_LOGIN_REDIRECT_URL;

  return (
    <div className="landing">
      <div className="landing-title">
        <Text
          variant={TextVariant.HEADING}
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
      <div className="landing-login-button">
        <div>
          <Button
            variant={ButtonVariant.SUBMIT}
            onClick={() =>
              window.location.replace(`${LOGIN_EP_URL}?state=${from}`)
            }
          >
            Create new account
          </Button>
        </div>
        <div>
          <Button
            variant={ButtonVariant.ALTERNATIVE}
            onClick={() =>
              window.location.replace(`${LOGIN_EP_URL}?state=${from}`)
            }
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
