import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { authApi } from '../../shared/services/ApiService';
import { SubmitStatus } from '../../shared/types';
import { LOGIN_OPTIONS_URL } from '../../shared/urls';
import './RegisterPage.css';

export default function RegisterPage() {
  const initialuserRegisterUserDto: RegisterUserDto = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmationPassword: '',
  };
  const [userRegisterUserDto, updateUserRegisterUserDto] = useReducer(
    (userRegisterUserDto: RegisterUserDto, updateUserRegisterUserDto: any) => ({
      ...userRegisterUserDto,
      ...updateUserRegisterUserDto,
    }),
    initialuserRegisterUserDto,
  );
  const [status, setStatus] = useState<SubmitStatus>({
    type: 'pending',
    message: '',
  });
  const navigate = useNavigate();
  async function register() {
    try {
      await authApi.authControllerRegisterLocalUser({
        registerUserDto: userRegisterUserDto,
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
            message: 'Invalid email or wrong passwords',
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
              value={userRegisterUserDto.username}
              name="username"
              onChange={(e) => {
                updateUserRegisterUserDto({ username: e.target.value });
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Email"
              placeholder="email"
              value={userRegisterUserDto.email}
              name="email"
              onChange={(e) => {
                updateUserRegisterUserDto({ email: e.target.value });
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Full Name"
              placeholder="full name"
              value={userRegisterUserDto.fullName}
              name="fullname"
              onChange={(e) => {
                updateUserRegisterUserDto({ fullName: e.target.value });
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              label="Password"
              placeholder="password"
              value={userRegisterUserDto.password}
              name="password"
              type="password"
              onChange={(e) => {
                updateUserRegisterUserDto({ password: e.target.value });
              }}
            />
            <Input
              variant={InputVariant.LIGHT}
              placeholder="repeat password"
              value={userRegisterUserDto.confirmationPassword}
              name="confirmationPassword"
              type="password"
              onChange={(e) => {
                updateUserRegisterUserDto({
                  confirmationPassword: e.target.value,
                });
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
