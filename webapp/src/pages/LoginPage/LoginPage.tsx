import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ResponseError } from '../../shared/generated';
import { authApi } from '../../shared/services/ApiService';
import { LOGIN_EP_URL, REGISTER_URL, USERS_URL } from '../../shared/urls';
import './LoginPage.css';

type SubmitStatus = {
  type: 'success' | 'error' | 'pending';
  message: string;
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<SubmitStatus>({
    type: 'pending',
    message: '',
  });

  async function login() {
    try {
      await authApi.authControllerLoginLocalUser({
        loginUserDto: { username, password },
      });
      window.location.replace(USERS_URL);
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error.response.status === 403 || error.response.status === 401) {
          setStatus({
            type: 'error',
            message: 'Incorrect username or password',
          });
        } else {
          setStatus({ type: 'error', message: `${error.response.statusText}` });
        }
      } else if (error instanceof Error) {
        setStatus({ type: 'error', message: `${error.message}` });
      }
    }
  }
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login();
  };

  return (
    <div className="login">
      <div className="login-title">
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
            <Text
              variant={TextVariant.PARAGRAPH}
              color={
                status.type === 'success' ? TextColor.ONLINE : TextColor.OFFLINE
              }
            >
              {status.message}
            </Text>
          </div>
        </form>
        <Button
          form="login-form"
          variant={ButtonVariant.SUBMIT}
          iconVariant={IconVariant.LOGIN}
          children="Login"
        />
        <div className="final-text">
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
            children="No account?&nbsp;"
          />
          <Link to={REGISTER_URL}>
            <Text
              variant={TextVariant.SUBHEADING}
              color={TextColor.LIGHT}
              weight={TextWeight.BOLD}
              children="Create one"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
