import {
  AvatarPageTemplate,
  ButtonVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import socket from '../../shared/socket';
import { UserToRoleDto, UserToRoleDtoRoleEnum } from '../../shared/generated';
import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '../../shared/services/ApiService';

type UserToRoleDtoProps = UserToRoleDto & {
  username: string;
};
export default function AdminPage() {
  const { authUser, isLoading } = useAuth();
  const [userToRoleValues, setUserToRoleValues] = useState<UserToRoleDtoProps>({
    username: '',
    role: 'moderator',
    id: '',
  });
  const getUserId = useCallback(() => {
    if (userToRoleValues.username !== '')
      return usersApi.userControllerGetUserByUserName({
        userName: userToRoleValues.username,
      });
    return Promise.reject(new Error('bad stuff'));
  }, [userToRoleValues]);
  const [destUserId, setDestUserId] = useState<string>('');

  useEffect(() => {
    if (userToRoleValues) {
      usersApi
        .userControllerGetUserByUserName({
          userName: userToRoleValues.username,
        })
        .then((user) => setDestUserId(user.id));
    }
  }, [userToRoleValues]);
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (destUserId !== '') {
      socket.emit('setUserWithRoles', {
        id: destUserId,
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
  if (!userToRoleValues) {
    return <></>;
  }
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
          value={userToRoleValues.username}
          name="username"
          onChange={handleInputChange}
        />
      </form>
    </AvatarPageTemplate>
  );
}
