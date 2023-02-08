import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import {
  EDIT_USER_AVATAR_URL,
  AVATAR_EP_URL,
  EDIT_USER_PASSWORD_URL,
  USER_ME_URL,
} from '../../shared/urls';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { ResponseError, UpdateUserDto } from '../../shared/generated';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useState } from 'react';
import { usersApi } from '../../shared/services/ApiService';

export default function EditUserPage() {
  const { authUser, setAuthUser, isLoading } = useAuth();
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
      setAuthUser((prevState) => {
        if (!prevState) return null;
        return { ...prevState, ...formValues };
      });
      navigate(USER_ME_URL);
    } catch (error) {
      await handleRequestError(error);
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
        editUrl: EDIT_USER_AVATAR_URL,
        XCoordinate: authUser!.avatarX,
        YCoordinate: authUser!.avatarY,
      }}
      secondaryButton={{
        children: 'save',
        variant: ButtonVariant.SUBMIT,
        form: 'edit-user-form',
      }}
      //TODO: users from oauth42 have null password, disable?
      button={
        authUser && authUser.isLocal
          ? {
              children: 'edit password',
              variant: ButtonVariant.ALTERNATIVE,
              onClick: () => navigate(EDIT_USER_PASSWORD_URL),
            }
          : undefined
      }
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
          type="email"
          name="email"
          onChange={handleInputChange}
        />
      </form>
    </AvatarPageTemplate>
  );
}
