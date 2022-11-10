import React, { useState } from 'react';
import { Button, ButtonVariant, Input, InputVariant } from '../';
import './EditUserForm.css';
import { usersApi } from '../../services/ApiService';
import { ResponseError } from '../../generated';
import { useAuth } from '../../hooks/UseAuth';
import { useNotificationContext } from '../../context/NotificationContext';

type EditUserProps = {
  origUsername: string;
  origFullName: string;
  origEmail: string;
};

export default function EditUserForm({
  origUsername,
  origFullName,
  origEmail,
}: EditUserProps) {
  const [username, setUsername] = useState(origUsername);
  const [fullName, setFullName] = useState(origFullName);
  const [email, setEmail] = useState(origEmail);
  const { setAuthUser } = useAuth();
  const { warn, notify } = useNotificationContext();

  async function updateData() {
    try {
      await usersApi.userControllerUpdateCurrentUser({
        updateUserDto: { username, fullName, email },
      });

      notify('Updated successfully');

      setAuthUser((prevState) => {
        if (!prevState) return null;
        return { ...prevState, username, fullName, email };
      });
    } catch (error) {
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
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateData();
  };

  return (
    <form
      id="edit-user-form"
      className="edit-user-form"
      onSubmit={handleOnSubmit}
    >
      <div className="inputs-container">
        <Input
          variant={InputVariant.LIGHT}
          label="Username"
          placeholder="Username"
          value={username}
          name="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          variant={InputVariant.LIGHT}
          label="Full Name"
          placeholder="Full Name"
          value={fullName}
          name="fullName"
          onChange={(e) => {
            setFullName(e.target.value);
          }}
        />
        <Input
          variant={InputVariant.LIGHT}
          label="Email"
          placeholder="Email"
          value={email}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <Button
        form="edit-user-form"
        children="Save"
        variant={ButtonVariant.SUBMIT}
      />
    </form>
  );
}
