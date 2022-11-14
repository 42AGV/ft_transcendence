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
  const [disabled, setDisabled] = useState(false);

  const initialFormValues: UpdateChatroomDto = {
    name: isLoading ? '' : chatroom!.name,
    oldPassword: '',
    newPassword: '',
    confirmationPassword: '',
  };
  const [formValues, setFormValues] =
    useState<UpdateChatroomDto>(initialFormValues);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };

  function hasValidFormValues() {
    if (formValues.newPassword !== formValues.confirmationPassword) {
      warn('Passwords are different');
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
          name: formValues.name ? formValues.name : initialFormValues.name,
          oldPassword: formValues.oldPassword || null,
          newPassword: formValues.newPassword || null,
          confirmationPassword: formValues.confirmationPassword || null,
        },
      });
      notify('Chatroom details successfully updated');
      navigate(CHAT_URL);
    } catch (error) {
      let errMessage = '';
      if (error instanceof ResponseError) {
        errMessage = `${error.response.statusText}`;
      } else if (error instanceof Error) {
        errMessage = `${error.message}`;
      }
      warn(errMessage);
    }
  }
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateChatroomDetails().catch((e) => console.error(e));
  };
  const deleteChatoom = () => {
    if (window.confirm('Are you sure you want to delete the chatroom?')) {
      try {
        chatApi.chatControllerDeleteChatroom({
          chatroomId: chatroomId!,
        });
        notify('Chatroom successfully deleted');
        navigate(CHAT_URL);
      } catch (error) {
        let errMessage = '';
        if (error instanceof ResponseError) {
          errMessage = `${error.response.statusText}`;
        } else if (error instanceof Error) {
          errMessage = `${error.message}`;
        }
        warn(errMessage);
      }
    }
  };

  if (!chatroom) {
    return (
      <div className="edit-chatroom-details">
        <div className="edit-chatroom-details-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="edit-chatroom-details">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {`edit/${chatroom.name}`}
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
          <ToggleSwitch
            isToggled={disabled}
            onToggle={() => setDisabled(!disabled)}
            label={disabled ? 'private channel' : 'public channel'}
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
            placeholder={chatroom.name}
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
            disabled={disabled}
          />
          <Input
            variant={InputVariant.LIGHT}
            label="New password"
            placeholder="new password"
            value={formValues.newPassword ? formValues.newPassword : ''}
            name="newPassword"
            type="password"
            onChange={handleInputChange}
            disabled={disabled}
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
            disabled={disabled}
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
