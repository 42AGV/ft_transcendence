import {
  Button,
  ButtonVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { LOGIN_EP_URL } from '../../shared/urls';
import './Landing.css';

export default function Landing() {
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
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => (window.location.replace(LOGIN_EP_URL))}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
