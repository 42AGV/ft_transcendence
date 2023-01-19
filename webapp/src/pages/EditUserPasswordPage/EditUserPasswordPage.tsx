import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import { AVATAR_EP_URL, USER_ME_URL } from '../../shared/urls';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import React, { useState } from 'react';
import { UpdateUserDto } from '../../shared/generated';
import { usersApi } from '../../shared/services/ApiService';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useAuth } from '../../shared/hooks/UseAuth';
import { handleRequestError } from '../../shared/utils/HandleRequestError';

export default function EditUserPasswordPage() {
  const { authUser, isLoading } = useAuth();
  const { navigate } = useNavigation();
  const { warn, notify } = useNotificationContext();

  const initialFormValues: UpdateUserDto = {
    oldPassword: '',
    password: '',
    confirmationPassword: '',
  };
  const [formValues, setFormValues] =
    useState<UpdateUserDto>(initialFormValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };

  function hasValidFormValues() {
    if (formValues.oldPassword === '') {
      warn('Old password can not be empty');
      return false;
    }
    if (formValues.password === '') {
      warn('Password can not be empty');
      return false;
    }
    if (formValues.password !== formValues.confirmationPassword) {
      warn('Password and Confirmation Password must match');
      return false;
    }
    return true;
  }

  async function updatePassword() {
    if (!authUser || !hasValidFormValues()) {
      return;
    }
    try {
      await usersApi.userControllerUpdateCurrentUser({
        updateUserDto: formValues,
      });
      notify('Password successfully updated');
      navigate(USER_ME_URL);
    } catch (error) {
      await handleRequestError(error, 'Password could not be updated', warn);
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updatePassword().catch((e) => console.error(e));
  };

  return (
    <div className="edit-user-password-page">
      <AvatarPageTemplate
        isLoading={isLoading}
        title={`edit/password`}
        avatarProps={{
          url: `${AVATAR_EP_URL}/${authUser?.avatarId}`,
          XCoordinate: authUser?.avatarX,
          YCoordinate: authUser?.avatarY,
        }}
        button={{
          children: 'save',
          variant: ButtonVariant.SUBMIT,
          form: 'edit-user-password-form',
        }}
        isNotFound={authUser == null}
      >
        <form
          id="edit-user-password-form"
          className="edit-user-password-form"
          onSubmit={handleOnSubmit}
        >
          <Input
            variant={InputVariant.LIGHT}
            label="Old password"
            placeholder="old password"
            value={formValues.oldPassword ? formValues.oldPassword : ''}
            name="oldPassword"
            type="password"
            onChange={handleInputChange}
          />
          <Input
            variant={InputVariant.LIGHT}
            label="New password"
            placeholder="new password"
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
        </form>
      </AvatarPageTemplate>
    </div>
  );
}
