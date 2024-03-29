import {
  AvatarPageTemplate,
  ButtonVariant,
  IconVariant,
  Input,
  InputVariant,
  ToggleSwitch,
  CustomConfirmAlert,
} from '../../shared/components';
import {
  ADMIN_URL,
  AVATAR_EP_URL,
  CHATROOM_URL,
  CHATS_URL,
} from '../../shared/urls';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import React, { useCallback, useEffect, useState } from 'react';
import { UpdateChatroomDto } from '../../shared/generated';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './EditChatroomDetailsPage.css';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useGetChatroomMember } from '../../shared/hooks/UseGetChatroomMember';
import { handleRequestError } from '../../shared/utils/HandleRequestError';
import { LoadingPage } from '../index';

export default function EditChatroomDetailsPage() {
  const { pathname } = useLocation();
  const overridePermissions = pathname.slice(0, ADMIN_URL.length) === ADMIN_URL;
  const { authUser } = useAuth();
  const { chatroomId } = useParams();
  const { navigate } = useNavigation();
  const { warn, notify } = useNotificationContext();
  const { data: authCrMember, isLoading: isAuthCrMemberLoading } =
    useGetChatroomMember(chatroomId!, authUser?.id);

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
      navigate(
        `${
          overridePermissions ? ADMIN_URL : ''
        }${CHATROOM_URL}/${chatroomId}/details`,
      );
    } catch (error) {
      handleRequestError(error, "Couldn't update chatroom", warn);
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateChatroomDetails().catch((e) => console.error(e));
  };

  const deleteChatoom = async () => {
    CustomConfirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete the chatroom?',
      buttons: [
        {
          children: 'Yes',
          onClick: () => {
            try {
              chatApi.chatControllerDeleteChatroom({
                chatroomId: chatroomId!,
              });
              notify('Chatroom successfully deleted');
              navigate(`${overridePermissions ? ADMIN_URL : ''}${CHATS_URL}`, {
                replace: true,
              });
            } catch (error) {
              handleRequestError(error, "Couldn't delete chatroom", warn);
            }
          },
        },
        {
          children: 'No',
        },
      ],
    });
  };

  if (isLoading || isAuthCrMemberLoading) {
    return <LoadingPage />;
  }

  if (
    !chatroom ||
    ((!authCrMember || !authCrMember.owner) && !overridePermissions)
  ) {
    return <NotFoundPage />;
  }

  return (
    <div className="edit-chatroom-details-page">
      <AvatarPageTemplate
        isLoading={isLoading}
        title={`edit/${chatroom.name}`}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${chatroom.avatarId}`,
          editUrl: overridePermissions
            ? undefined
            : `${CHATROOM_URL}/${chatroom.id}/edit/avatar`,
          XCoordinate: chatroom?.avatarX,
          YCoordinate: chatroom?.avatarY,
        }}
        button={{
          iconVariant: IconVariant.REMOVE,
          children: 'Delete chatroom',
          variant: ButtonVariant.WARNING,
          onClick: deleteChatoom,
        }}
        secondaryButton={{
          iconVariant: IconVariant.EDIT,
          form: 'edit-chatroom-details-form',
          children: 'Save',
          variant: ButtonVariant.SUBMIT,
        }}
        isNotFound={false}
        captionLikeElement={
          <ToggleSwitch
            isToggled={!isPublic}
            onToggle={() => setIsPublic(!isPublic)}
            label={isPublic ? 'public channel' : 'private channel'}
          />
        }
      >
        <form
          id="edit-chatroom-details-form"
          className="edit-chatroom-details-form"
          onSubmit={handleOnSubmit}
        >
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
        </form>
      </AvatarPageTemplate>
    </div>
  );
}
