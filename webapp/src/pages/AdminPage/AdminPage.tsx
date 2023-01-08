import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import socket from '../../shared/socket';
import { UserToRoleDto, UserToRoleDtoRoleEnum } from '../../shared/generated';
import { useCallback, useState } from 'react';
import { usersApi } from '../../shared/services/ApiService';

type UserToRoleDtoProps = UserToRoleDto & {
  username: string;
};
export default function AdminPage() {
  const { authUser, isLoading } = useAuth();
  const [userToRoleValues, setUserToRoleValues] =
    useState<UserToRoleDtoProps | null>(null);
  const getUserId = useCallback(
    (username: string) => {
      if (userToRoleValues && userToRoleValues.username !== '')
        return usersApi.userControllerGetUserByUserName({
          userName: username,
        });
      return Promise.reject(new Error('bad stuff'));
    },
    [userToRoleValues],
  );
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userToRoleValues) {
      const userToModify = await getUserId(userToRoleValues.username);
      socket.emit('toggleUserWithRoles', {
        id: userToModify.id,
        role: UserToRoleDtoRoleEnum.Moderator,
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserToRoleValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };
  return (
    <AvatarPageTemplate
      isLoading={isLoading}
      isNotFound={!authUser}
      title="Admin Page"
      button={{
        children: 'save',
        variant: ButtonVariant.SUBMIT,
        form: 'add-role-form',
      }}
    >
      <form
        id="add-role-form"
        className="add-role-form"
        onSubmit={handleOnSubmit}
      >
        <Input
          variant={InputVariant.LIGHT}
          label="Username"
          placeholder="Username"
          value={userToRoleValues?.username ?? ''}
          name="username"
          onChange={handleInputChange}
        />
      </form>
    </AvatarPageTemplate>
  );
}
