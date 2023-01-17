import {
  AvatarPageTemplate,
  Button,
  ButtonVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import socket from '../../shared/socket';
import {
  ResponseError,
  UserToRoleDto,
  UserToRoleDtoRoleEnum,
} from '../../shared/generated';
import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '../../shared/services/ApiService';
import { WsException } from '../../shared/types';
import { useNotificationContext } from '../../shared/context/NotificationContext';

type UserToRoleDtoProps = UserToRoleDto & {
  username: string;
};
export default function AdminPage() {
  const { warn } = useNotificationContext();
  const { authUser, isLoading } = useAuth();
  const [userToRoleValues, setUserToRoleValues] =
    useState<UserToRoleDtoProps | null>(null);
  const getUserId = useCallback(
    (username: string) => {
      if (userToRoleValues && userToRoleValues.username !== '')
        return usersApi.userControllerGetUserByUserName({
          userName: username,
        });
      return Promise.reject(new Error('Could not get user with username'));
    },
    [userToRoleValues],
  );
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userToRoleValues) {
      try {
        const userToModify = await getUserId(userToRoleValues.username);
        socket.emit('toggleUserWithRoles', {
          id: userToModify.id,
          role: UserToRoleDtoRoleEnum.Banned,
        });
      } catch (error: unknown) {
        if (error instanceof ResponseError) {
          const responseBody = await error.response.json();
          if (responseBody.message) {
            warn(responseBody.message);
          } else {
            warn(error.response.statusText);
          }
        } else if (error instanceof Error) {
          warn(error.message);
        } else {
          warn('Could not find user with username');
        }
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserToRoleValues((previousValues: any) => {
      return { ...previousValues, [name]: value };
    });
  };

  useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      warn(wsError.message);
    });

    return () => {
      socket.off('exception');
    };
  }, [warn]);

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
