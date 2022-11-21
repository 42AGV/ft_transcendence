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
import {
  CHAT_URL,
  EDIT_AVATAR_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import './CreateChatroomPage.css';
import React, { useState } from 'react';
import { CreateChatroomDto, ResponseError } from '../../shared/generated';
import { chatApi } from '../../shared/services/ApiService';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useNavigation } from '../../shared/hooks/UseNavigation';

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
      navigate(CHAT_URL);
    } catch (error) {
      if (error instanceof ResponseError) {
        warn(error.response.statusText);
      } else if (error instanceof Error) {
        warn(error.message);
      }
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    register().catch((e) => console.error(e));
  };

  const chatroom: Partial<Chatroom> = {};
  return (
    <div className="create-chatroom-page">
      <AvatarPageTemplate
        isLoading={false}
        title="create chatroom"
        avatarProps={{
          url:
            // TODO: Remove the wildcard avatar when we implement #317
            WILDCARD_AVATAR_URL,
          XCoordinate: chatroom?.avatarX ?? 0,
          YCoordinate: chatroom?.avatarY ?? 0,
          editUrl: EDIT_AVATAR_URL,
        }}
        button={{
          form: 'create-chat-page-form',
          children: 'Save',
          variant: ButtonVariant.SUBMIT,
        }}
        isNotFound={false}
      >
        <>
          <div className="create-chat-page-properties">
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
          </div>
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
    </div>
  );
}
