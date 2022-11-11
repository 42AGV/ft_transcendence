import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Input,
  InputVariant,
  LargeAvatar,
  Loading,
  MediumAvatar,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import {
  CHAT_URL,
  EDIT_AVATAR_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
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
    name: isLoading ? '' : chatroom!.name,
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
      await chatApi.chatControllerUpdateChatroom({
        chatroomId: chatroomId!,
        updateChatroomDto: {
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
    if (confirm('Are you sure you want to delete the chatroom?')) {
      chatApi.chatControllerUpdateChatroom({
        chatroomId: chatroomId!, //TODO update with delete
        updateChatroomDto: {
          ...formValues,
          password: formValues.password || null,
          confirmationPassword: formValues.confirmationPassword || null,
        },
      });
    }
  };
  if (!chatroom) {
    return (
      <div className="edit-user">
        <div className="edit-user-loading">
          <Loading />
        </div>
      </div>
    );
  }
  return (
    <div className="edit-chatroom-details">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {`edit/${chatroom!.name}`}
      </Header>
      <div className="edit-chatroom-details-avatar-properties">
        <div className="edit-chatroom-details-avatar">
          <LargeAvatar
            url={WILDCARD_AVATAR_URL}
            editUrl={EDIT_AVATAR_URL}
            XCoordinate={chatroom.avatarX}
            YCoordinate={chatroom.avatarY}
          />
        </div>
        <div className="edit-chatroom-details-properties">
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
        id="edit-chatroom-details-form"
        className="edit-chatroom-details-form"
        onSubmit={handleOnSubmit}
      >
        <div className="edit-chatroom-details-form-inputs-container">
          <Input
            variant={InputVariant.LIGHT}
            label="Chat Room Name"
            placeholder={isLoading ? '' : chatroom!.name}
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
      <div className="edit-chatroom-details-buttons">
        <Button
          iconVariant={IconVariant.EDIT}
          children="Delete chatroom"
          variant={ButtonVariant.WARNING}
          onClick={deleteChatoom}
        />
        <Button
          form="edit-chatroom-details-form"
          children="Save"
          variant={ButtonVariant.SUBMIT}
        />
      </div>
    </div>
  );
}