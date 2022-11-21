import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Input,
  InputVariant,
  LargeAvatar,
  Loading,
  ToggleSwitch,
} from '../../shared/components';
import {
  CHATROOM_EP_URL,
  CHAT_URL,
  EDIT_AVATAR_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { useCallback, useEffect, useState } from 'react';
import { ResponseError, UpdateChatroomDto } from '../../shared/generated';
import './EditChatroomDetailsPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

export default function CreateChatroomPage() {
  const { chatroomId } = useParams();
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const { warn, notify } = useNotificationContext();

  const getChatRoomById = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom, isLoading } = useData(getChatRoomById);
  const [isPublic, setIsPublic] = useState(false);

  const initialFormValues: UpdateChatroomDto = {
    name: '',
    oldPassword: '',
    password: '',
    confirmationPassword: '',
  };
  const [formValues, setFormValues] =
    useState<UpdateChatroomDto>(initialFormValues);

  useEffect(() => {
    if (chatroom) {
      setIsPublic(chatroom.isPublic);
      setFormValues((prevValues) => {
        return { ...prevValues, name: chatroom.name };
      });
    }
  }, [chatroom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };

  function hasValidFormValues() {
    if (formValues.name === '') {
      warn('Chatroom name can not be empty');
      return false;
    }
    if (
      chatroom &&
      !chatroom.isPublic &&
      !isPublic &&
      formValues.password !== '' &&
      formValues.oldPassword === ''
    ) {
      warn('Old password can not be empty');
      return false;
    }
    if (
      chatroom &&
      chatroom.isPublic &&
      !isPublic &&
      formValues.password === ''
    ) {
      warn('Password can not be empty');
      return false;
    }
    if (
      chatroom &&
      !chatroom.isPublic &&
      !isPublic &&
      formValues.oldPassword &&
      !formValues.password
    ) {
      warn('Password can not be empty');
      return false;
    }
    if (formValues.password !== formValues.confirmationPassword) {
      warn('Password and Confirmation Password must match');
      return false;
    }
    return true;
  }

  // TODO: We can move this function to shared directory
  const handleRequestError = async (error: unknown) => {
    let errMessage = '';
    if (error instanceof ResponseError) {
      const responseBody = await error.response.json();
      if (responseBody.message) {
        errMessage = responseBody.message;
      } else {
        errMessage = error.response.statusText;
      }
    } else if (error instanceof Error) {
      errMessage = error.message;
    }
    warn(errMessage);
  };

  async function updateChatroomDetails() {
    if (!chatroom || !chatroomId || !hasValidFormValues()) {
      return;
    }
    try {
      let updateChatroomDto: UpdateChatroomDto;
      // Update public chatroom
      if (chatroom.isPublic && isPublic) {
        updateChatroomDto = {
          name: formValues.name || undefined,
        };
        // Update from public to protected
      } else if (chatroom.isPublic && !isPublic) {
        updateChatroomDto = {
          name: formValues.name || undefined,
          oldPassword: null,
          password: formValues.password,
          confirmationPassword: formValues.confirmationPassword,
        };
        // Update from protected to public
      } else if (!chatroom.isPublic && isPublic) {
        updateChatroomDto = {
          name: formValues.name || undefined,
          oldPassword: formValues.oldPassword,
          password: null,
          confirmationPassword: null,
        };
        // Update from protected to protected
      } else {
        updateChatroomDto = {
          name: formValues.name || undefined,
          oldPassword: formValues.oldPassword || undefined,
          password: formValues.password || undefined,
          confirmationPassword: formValues.confirmationPassword || undefined,
        };
      }
      await chatApi.chatControllerUpdateChatroom({
        chatroomId: chatroomId!,
        updateChatroomDto,
      });
      notify('Chatroom details successfully updated');
      navigate(CHAT_URL);
    } catch (error) {
      handleRequestError(error);
    }
  }
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateChatroomDetails().catch((e) => console.error(e));
  };
  const deleteChatoom = async () => {
    if (window.confirm('Are you sure you want to delete the chatroom?')) {
      try {
        chatApi.chatControllerDeleteChatroom({
          chatroomId: chatroomId!,
        });
        notify('Chatroom successfully deleted');
        navigate(CHAT_URL);
      } catch (error) {
        handleRequestError(error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="edit-chatroom-details">
        <div className="edit-chatroom-details-loading">
          <Loading />
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return <NotFoundPage />;
  }

  return (
    <div className="edit-chatroom-details">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {`edit/${chatroom.name}`}
      </Header>
      <div className="edit-chatroom-details-avatar-properties">
        <div className="edit-chatroom-details-avatar">
          <LargeAvatar
            // TODO: Remove the wildcard avatar when we implement #317
            url={
              chatroom.avatarId
                ? `${CHATROOM_EP_URL}/${chatroom.id}/avatars/${chatroom.avatarId}`
                : WILDCARD_AVATAR_URL
            }
            //TODO: update url to EDIT_CHAT_AVATAR_URL or a common page
            editUrl={EDIT_AVATAR_URL}
            XCoordinate={chatroom.avatarX}
            YCoordinate={chatroom.avatarY}
          />
        </div>
        <div className="edit-chatroom-details-properties">
          <ToggleSwitch
            isToggled={!isPublic}
            onToggle={() => setIsPublic(!isPublic)}
            label={isPublic ? 'public channel' : 'private channel'}
          />
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
            placeholder="name"
            value={formValues.name}
            name="name"
            onChange={handleInputChange}
          />
          <Input
            variant={InputVariant.LIGHT}
            label="Old password"
            placeholder="old password"
            value={formValues.oldPassword ? formValues.oldPassword : ''}
            name="oldPassword"
            type="password"
            onChange={handleInputChange}
            disabled={chatroom.isPublic}
          />
          <Input
            variant={InputVariant.LIGHT}
            label="New password"
            placeholder="new password"
            value={formValues.password ? formValues.password : ''}
            name="password"
            type="password"
            onChange={handleInputChange}
            disabled={isPublic}
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
            disabled={isPublic}
          />
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
