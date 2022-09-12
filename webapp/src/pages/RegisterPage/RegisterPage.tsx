import { useState } from 'react';
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
import { ResponseError } from '../../shared/generated';
import { authApi } from '../../shared/services/ApiService';
import { SubmitStatus } from '../../shared/types';
import { LOGIN_OPTIONS_URL } from '../../shared/urls';
import './RegisterPage.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [fullName, SetFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [status, setStatus] = useState<SubmitStatus>({
    type: 'pending',
    message: '',
  });
  async function register() {
    try {
      await authApi.authControllerRegisterLocalUser({
        registerUserDto: {
          username,
          password,
          confirmationPassword,
          email,
          fullName,
        },
      });
      window.location.replace(LOGIN_OPTIONS_URL);
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
    register();
  };

  return (
    <div className="register">
      <div className="register-title">
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
      <div className="register-container">
        <form
          id="register-form"
          className="register-form"
          onSubmit={handleOnSubmit}
        >
          <div className="inputs-container">
            <Input
              variant={InputVariant.LIGHT}
              label="Username"
              placeholder="username"
              value={username}
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Email"
              placeholder="email"
              value={email}
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Full Name"
              placeholder="full name"
              value={fullName}
              name="fullname"
              onChange={(e) => {
                SetFullName(e.target.value);
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Password"
              placeholder="password"
              value={password}
              name="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              placeholder="repeat password"
              value={confirmationPassword}
              name="confirmationPassword"
              type="password"
              onChange={(e) => {
                setConfirmationPassword(e.target.value);
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
            <Button variant={ButtonVariant.SUBMIT}>Create new account</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
