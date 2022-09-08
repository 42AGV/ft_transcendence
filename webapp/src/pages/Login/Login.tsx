import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  Input,
  InputVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { DEFAULT_LOGIN_REDIRECT_URL, LOGIN_EP_URL } from '../../shared/urls';
import './Login.css';

type LocationState = {
  state: {
    from: Location;
  };
};

export default function Login() {
  const location = useLocation() as LocationState;
  const from = location.state?.from?.pathname || DEFAULT_LOGIN_REDIRECT_URL;
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="login">
      <div className="landing-title">
        <Text
          variant={TextVariant.HEADING}
          color={TextColor.GAME}
          weight={TextWeight.BOLD}
        >
          PONG
        </Text>
      </div>
      <div className="login-container">
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() =>
            window.location.replace(`${LOGIN_EP_URL}?state=${from}`)
          }
        >
          Login with 42
        </Button>
        <Text
          variant={TextVariant.SUBHEADING}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
        >
          or
        </Text>
        <form id="login-form" className="login-form" onSubmit={handleOnSubmit}>
          <div className="inputs-container">
            <Input
              variant={InputVariant.LIGHT}
              placeholder="Username"
              value={username}
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              placeholder="Password"
              value={password}
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </form>
        <Button
          form="login-form"
          variant={ButtonVariant.SUBMIT}
          children="Login with 42"
        />
        <Text
          variant={TextVariant.SUBHEADING}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
          children="Forgot password?"
        />
        <Text
          variant={TextVariant.SUBHEADING}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
          children="No account? Create one"
        />
      </div>
    </div>
  );
}
