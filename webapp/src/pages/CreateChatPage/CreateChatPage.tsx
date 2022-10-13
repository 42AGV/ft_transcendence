import { useState } from 'react';
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
import { CreateChatDto, ResponseError } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { SubmitStatus } from '../../shared/types';
import {
  DEFAULT_LOGIN_REDIRECT_URL,
  LOGIN_OPTIONS_URL,
} from '../../shared/urls';
import './CreateChat.css';

export default function CreateChat() {
  const initialFormValues: CreateChatDto = {
    chatName: '',
    password: '',
    confirmationPassword: '',
  };
  const navigate = useNavigate();
  const [formValues, setFormValues] =
    useState<CreateChatDto>(initialFormValues);
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
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };
  function hasValidFormValues() {
    if (formValues.chatName === '') {
      setStatus({
        type: 'error',
        message: 'ChatName can not be empty',
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
      await {
        createChatDto: formValues, //TODO: updated with
      };
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
            message: 'ChatName already registered',
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
    <div className="create-chat">
      <div className="create-chat-title">
        <Text
          variant={TextVariant.TITLE}
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
      <div className="create-chat-container">
        <form
          id="create-chat-form"
          className="create-chat-form"
          onSubmit={handleOnSubmit}
        >
          <div className="inputs-container">
            <Input
              variant={InputVariant.LIGHT}
              label="ChatName"
              placeholder="chatName"
              value={formValues.chatName}
              name="chatName"
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