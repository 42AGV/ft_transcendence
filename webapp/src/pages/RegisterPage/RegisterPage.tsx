import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
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
import { RegisterUserDto, ResponseError } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { authApi } from '../../shared/services/ApiService';
import { SubmitStatus } from '../../shared/types';
import {
  DEFAULT_LOGIN_REDIRECT_URL,
  LOGIN_OPTIONS_URL,
  HOST_URL,
} from '../../shared/urls';
import './RegisterPage.css';

export default function RegisterPage() {
  const initialFormValues: RegisterUserDto = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmationPassword: '',
  };
  const navigate = useNavigate();
  const [formValues, setFormValues] =
    useState<RegisterUserDto>(initialFormValues);
  const [status, setStatus] = useState<SubmitStatus>({
    type: 'pending',
    message: '',
  });

  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={DEFAULT_LOGIN_REDIRECT_URL} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues) => {
      return { ...previousValues, [name]: value };
    });
  };
  function hasValidFormValues() {
    if (formValues.username === '') {
      setStatus({
        type: 'error',
        message: 'Username can not be empty',
      });
      return false;
    } else if (formValues.email === '') {
      setStatus({
        type: 'error',
        message: 'Email can not be empty',
      });
      return false;
    } else if (formValues.fullName === '') {
      setStatus({
        type: 'error',
        message: 'Full Name can not be empty',
      });
      return false;
    } else if (formValues.password === '') {
      setStatus({
        type: 'error',
        message: 'Password can not be empty',
      });
      return false;
    } else if (formValues.password !== formValues.confirmationPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords are different',
      });
      return false;
    }
    return true;
  }
  async function register() {
    if (!hasValidFormValues()) {
      return;
    }
    try {
      await authApi.authControllerRegisterLocalUser({
        registerUserDto: formValues,
      });
      setStatus({
        type: 'success',
        message: 'Registration complete',
      });
      setTimeout(() => {
        navigate(LOGIN_OPTIONS_URL);
      }, 2000);
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error.response.status === 422) {
          setStatus({
            type: 'error',
            message: 'Username already registered',
          });
        } else if (error.response.status === 400) {
          setStatus({
            type: 'error',
            message: 'Invalid email',
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
    register().catch((e) => console.error(e));
  };

  return (
    <div className="register">
      <Link className="register-title" to={HOST_URL}>
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
              value={formValues.username}
              name="username"
              onChange={handleInputChange}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Email"
              placeholder="email"
              value={formValues.email}
              name="email"
              type="email"
              onChange={handleInputChange}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Full Name"
              placeholder="full name"
              value={formValues.fullName}
              name="fullName"
              onChange={handleInputChange}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Password"
              placeholder="password"
              value={formValues.password}
              name="password"
              type="password"
              onChange={handleInputChange}
            />
            <Input
              variant={InputVariant.LIGHT}
              placeholder="repeat password"
              value={formValues.confirmationPassword}
              name="confirmationPassword"
              type="password"
              onChange={handleInputChange}
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
