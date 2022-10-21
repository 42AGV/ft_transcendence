import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Input,
  InputVariant,
  MediumAvatar,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import {
  CHAT_URL,
  DEFAULT_LOGIN_REDIRECT_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { Navigate, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import './CreateChatRoomPage.css';
import { useEffect, useState } from 'react';
import { chatsApi } from '../../shared/services/ApiService';
import { CreateChatDto, ResponseError } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';

type FormStatus = {
  type: 'success' | 'error' | 'pending';
  message: string;
};

const initialSubmitFormStatus: FormStatus = {
  type: 'pending',
  message: '',
};

export default function CreateChatRoomPage() {
  const initialFormValues: CreateChatDto = {
    chatName: '',
    password: '',
    confirmationPassword: '',
    owner: '',
  };
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const [formValues, setFormValues] =
    useState<CreateChatDto>(initialFormValues);
  const [status, setStatus] = useState<FormStatus>({
    type: 'pending',
    message: '',
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(initialSubmitFormStatus);
    }, 5000);
    return () => clearTimeout(timer);
  }, [status]);
  const { isLoggedIn, authUser } = useAuth();
  if (authUser) {
    formValues.owner = authUser.id;
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
      await chatsApi.chatControllerAddChat({
        createChatDto: formValues,
      });
      setStatus({
        type: 'success',
        message: 'Registration complete',
      });
      setTimeout(() => {
        navigate(CHAT_URL);
      }, 2000);
    } catch (error) {
      if (error instanceof ResponseError) {
        setStatus({ type: 'error', message: `${error.response.statusText}` });
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
    <div className="create-chat-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack()}>
        add chat
      </Header>
      <div className="create-chat-page-avatar-properties">
        <div className="create-chat-page-avatar">
          <MediumAvatar url={WILDCARD_AVATAR_URL} />
        </div>
        <div className="create-chat-page-properties">
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
          >
            {formValues.chatName ? formValues.chatName : 'chat name'}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
          >
            {formValues.password ? 'private channel' : 'public channel'}
          </Text>
        </div>
      </div>
      <form
        id="create-chat-page-form"
        className="create-chat-page-form"
        onSubmit={handleOnSubmit}
      >
        <div className="create-chat-page-form-inputs-container">
          <Input
            variant={InputVariant.LIGHT}
            label="ChatName"
            placeholder="chat name"
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
        </div>
      </form>
      <div className="create-chat-page-buttons">
        <Button
          form="create-chat-page-form"
          children="Save"
          variant={ButtonVariant.SUBMIT}
        />
      </div>
    </div>
  );
}
