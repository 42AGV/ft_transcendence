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
import { CHAT_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { useEffect, useState } from 'react';
import { CreateChatDto, ResponseError } from '../../shared/generated';
import './CreateChatRoomPage.css';
import { chatroomApi } from '../../shared/services/ApiService';

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
    name: '',
    password: '',
    confirmationPassword: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };

  function hasValidFormValues() {
    if (formValues.name === '') {
      setStatus({
        type: 'error',
        message: 'Chat room name can not be empty',
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
      console.log(formValues);
      await chatroomApi.chatControllerCreateChat({
        createChatDto: {
          ...formValues,
          password: formValues.password || null,
          confirmationPassword: formValues.confirmationPassword || null,
        },
      });
      setStatus({
        type: 'success',
        message: 'Registration complete',
      });
      setTimeout(() => {
        navigate(CHAT_URL);
      }, 2000);
    } catch (error) {
      console.log(formValues);
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
            {formValues.name ? formValues.name : 'chat room name'}
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
            label="Chat Room Name"
            placeholder="chat room name"
            value={formValues.name}
            name="name"
            onChange={handleInputChange}
          />
          <Input
            variant={InputVariant.LIGHT}
            label="Password"
            placeholder="password"
            value={formValues.password ? formValues.password : ''}
            name="password"
            type="password"
            onChange={handleInputChange}
          />
          <Input
            variant={InputVariant.LIGHT}
            placeholder="repeat password"
            value={
              formValues.confirmationPassword
                ? formValues.confirmationPassword
                : ''
            }
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
