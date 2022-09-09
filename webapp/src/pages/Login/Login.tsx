import { useState } from 'react';
import {
  Button,
  ButtonVariant,
  IconVariant,
  Input,
  InputVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { LOGIN_EP_URL } from '../../shared/urls';
import './Login.css';

export default function Login() {
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert(`username=${username}\npassword=${password}`);
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
          onClick={() => window.location.replace(`${LOGIN_EP_URL}`)}
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
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </form>
        <Button
          form="login-form"
          variant={ButtonVariant.SUBMIT}
          iconVariant={IconVariant.LOGIN}
          children="Login"
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
