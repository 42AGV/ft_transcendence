import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import {
  EDIT_AVATAR_URL,
  AVATAR_EP_URL,
  EDIT_USER_PASSWORD_URL,
  USER_ME_URL,
} from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { ResponseError, UpdateUserDto } from '../../shared/generated';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useState } from 'react';
import { usersApi } from '../../shared/services/ApiService';

export default function EditUserPage() {
  const { username } = useParams();
  const { authUser, isLoading } = useAuth(username);
  const { navigate } = useNavigation();
  const { warn, notify } = useNotificationContext();
  const initialFormValues: UpdateUserDto = {
    username: authUser?.username,
    fullName: authUser?.fullName,
    email: authUser?.email,
  };
  const [formValues, setFormValues] =
    useState<UpdateUserDto>(initialFormValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };
  const handleRequestError = async (error: unknown) => {
    let errMessage = '';
    if (error instanceof ResponseError) {
      if (error.response.status === 400) {
        errMessage = 'Invalid or missing fields';
      } else if (error.response.status === 422) {
        errMessage = 'Username already exists';
      } else {
        errMessage = `${error.response.statusText}`;
      }
    } else if (error instanceof Error) {
      errMessage = `${error.message}`;
    }
    warn(errMessage);
  };

  async function updateData() {
    try {
      await usersApi.userControllerUpdateCurrentUser({
        updateUserDto: formValues,
      });
      notify('Updated successfully');
      window.location.href = USER_ME_URL;
    } catch (error) {
      handleRequestError(error);
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateData().catch((e) => console.error(e));
  };
  return (
    <AvatarPageTemplate
      isLoading={isLoading}
      isNotFound={!authUser}
      title="edit profile"
      avatarProps={{
        url: `${AVATAR_EP_URL}/${authUser!.avatarId}`,
        editUrl: EDIT_AVATAR_URL,
        XCoordinate: authUser!.avatarX,
        YCoordinate: authUser!.avatarY,
      }}
      secondaryButton={{
        children: 'save',
        variant: ButtonVariant.SUBMIT,
        form: 'edit-user-form',
      }}
      button={{
        children: 'edit password',
        variant: ButtonVariant.ALTERNATIVE,
        onClick: () => navigate(EDIT_USER_PASSWORD_URL),
      }}
    >
      <form
        id="edit-user-form"
        className="edit-user-form"
        onSubmit={handleOnSubmit}
      >
        <Input
          variant={InputVariant.LIGHT}
          label="Username"
          placeholder="Username"
          value={formValues.username}
          name="username"
          onChange={handleInputChange}
        />
        <Input
          variant={InputVariant.LIGHT}
          label="Full Name"
          placeholder="Full Name"
          value={formValues.fullName}
          name="fullName"
          onChange={handleInputChange}
        />
        <Input
          variant={InputVariant.LIGHT}
          label="Email"
          placeholder="Email"
          value={formValues.email}
          name="email"
          onChange={handleInputChange}
        />
      </form>
    </AvatarPageTemplate>
  );
}
