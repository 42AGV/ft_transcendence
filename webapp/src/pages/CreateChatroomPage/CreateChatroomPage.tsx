import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { CHATS_URL } from '../../shared/urls';
import React, { useState } from 'react';
import { CreateChatroomDto } from '../../shared/generated';
import { chatApi } from '../../shared/services/ApiService';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { handleRequestError } from '../../shared/utils/HandleRequestError';

export default function CreateChatroomPage() {
  const { warn, notify } = useNotificationContext();
  const initialFormValues: CreateChatroomDto = {
    name: '',
    password: '',
    confirmationPassword: '',
  };
  const { navigate } = useNavigation();
  const [formValues, setFormValues] =
    useState<CreateChatroomDto>(initialFormValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };

  function hasValidFormValues() {
    if (formValues.name === '') {
      warn('Chat room name can not be empty');
      return false;
    } else if (formValues.password !== formValues.confirmationPassword) {
      warn('Passwords are different');
      return false;
    }
    return true;
  }

  async function register() {
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
      notify('Registration complete');
      navigate(CHATS_URL);
    } catch (error) {
      handleRequestError(
        error,
        'Could not complete chatroom registration',
        warn,
      );
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    register().catch((e) => console.error(e));
  };

  return (
    <AvatarPageTemplate
      isLoading={false}
      title="create chatroom"
      button={{
        form: 'create-chat-page-form',
        children: 'Save',
        variant: ButtonVariant.SUBMIT,
      }}
      isNotFound={false}
      captionLikeElement={
        <>
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
          >
            {formValues.name ? formValues.name : 'chatroom name'}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
          >
            {formValues.password ? 'private chatroom' : 'public chatroom'}
          </Text>
        </>
      }
    >
      <>
        <form
          id="create-chat-page-form"
          className="create-chat-page-form"
          onSubmit={handleOnSubmit}
        >
          <div className="create-chat-page-form-inputs-container">
            <Input
              variant={InputVariant.LIGHT}
              label="Name"
              placeholder="chatroom name"
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
          </div>
        </form>
      </>
    </AvatarPageTemplate>
  );
}
