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
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { useCallback, useEffect, useState } from 'react';
import { CreateChatroomDto, ResponseError } from '../../shared/generated';
import './EditChatroomDetailsPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';

type FormStatus = {
  type: 'success' | 'error' | 'pending';
  message: string;
};

const initialSubmitFormStatus: FormStatus = {
  type: 'pending',
  message: '',
};

export default function CreateChatroomPage() {
  const { chatroomId } = useParams();
  const getChatRoomById = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom, isLoading } = useData(getChatRoomById);

  const initialFormValues: CreateChatroomDto = {
    name: '',
    password: '',
    confirmationPassword: '',
  };
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const [formValues, setFormValues] =
    useState<CreateChatroomDto>(initialFormValues);
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
  async function updateChatroomDetails() {
    if (!hasValidFormValues()) {
      return;
    }
    try {
      await chatApi.chatControllerCreateChatroom({
        createChatroomDto: {
          ...formValues,
          password: formValues.password || null,
          confirmationPassword: formValues.confirmationPassword || null,
        },
      });
      setStatus({
        type: 'success',
        message: 'Chatroom details updated',
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
    updateChatroomDetails().catch((e) => console.error(e));
  };
  const deleteChatoom = () => {
    alert('Are you sure you want to delete the chatroom?');
  };
  return (
    <div className="edit-chatroom-details-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {isLoading ? '' : `${chatroom!.name}/edit details`}
      </Header>
      <div className="edit-chatroom-details-page-avatar-properties">
        <div className="edit-chatroom-details-page-avatar">
          {/* TODO: make chatroom avatar not null*/}
          <MediumAvatar url={WILDCARD_AVATAR_URL} />
        </div>
        <div className="edit-chatroom-details-page-properties">
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
        id="edit-chatroom-details-page-form"
        className="edit-chatroom-details-page-form"
        onSubmit={handleOnSubmit}
      >
        <div className="edit-chatroom-details-page-form-inputs-container">
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
      <div className="edit-chatroom-details-page-buttons">
        <Button
          iconVariant={IconVariant.EDIT}
          children="Delete chatroom"
          variant={ButtonVariant.WARNING}
          onClick={deleteChatoom}
        />
        <Button
          form="edit-chatroom-details-page-form"
          children="Save"
          variant={ButtonVariant.SUBMIT}
        />
      </div>
    </div>
  );
}
