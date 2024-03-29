import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  Input,
  InputVariant,
  LandingAnimationPageTemplate,
} from '../../shared/components';
import { RegisterUserDto, ResponseError } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { authApi } from '../../shared/services/ApiService';
import {
  DEFAULT_LOGIN_REDIRECT_URL,
  LOGIN_OPTIONS_URL,
} from '../../shared/urls';
import { useNotificationContext } from '../../shared/context/NotificationContext';

import './RegisterPage.css';
import { handleRequestError } from '../../shared/utils/HandleRequestError';

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
  const { isLoggedIn } = useAuth();
  const { warn, notify } = useNotificationContext();

  if (isLoggedIn) {
    return <Navigate to={DEFAULT_LOGIN_REDIRECT_URL} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues) => {
      return { ...previousValues, [name]: value };
    });
  };
  function hasValidFormValues(): boolean {
    let errMessage = '';

    if (formValues.username === '') {
      errMessage = 'Username can not be empty';
    } else if (formValues.email === '') {
      errMessage = 'Email can not be empty';
    } else if (formValues.fullName === '') {
      errMessage = 'Full Name can not be empty';
    } else if (formValues.password === '') {
      errMessage = 'Password can not be empty';
    } else if (formValues.password !== formValues.confirmationPassword) {
      errMessage = 'Passwords are different';
    }

    warn(errMessage);

    return !errMessage;
  }
  async function register() {
    if (!hasValidFormValues()) {
      return;
    }
    try {
      await authApi.authControllerRegisterLocalUser({
        registerUserDto: formValues,
      });

      notify('Registration complete');
      navigate(LOGIN_OPTIONS_URL);
    } catch (error) {
      let errMessage = '';

      if (error instanceof ResponseError) {
        if (error.response.status === 422) {
          errMessage = 'Username already registered';
        } else if (error.response.status === 400) {
          errMessage = 'Invalid email';
        } else {
          errMessage = `${error.response.statusText}`;
        }
      } else if (error instanceof Error) {
        errMessage = `${error.message}`;
      }

      warn(errMessage);
    }
  }
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    register().catch((e) =>
      handleRequestError(e, 'Could not register user', warn),
    );
  };

  return (
    <LandingAnimationPageTemplate>
      <div className="register-page">
        <form
          id="register-form"
          className="register-form"
          onSubmit={handleOnSubmit}
        >
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
          <Button variant={ButtonVariant.SUBMIT}>Create new account</Button>
        </form>
      </div>
    </LandingAnimationPageTemplate>
  );
}
