import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonVariant,
  Input,
  InputVariant,
  Text,
  TextColor,
  TextVariant,
} from '../';
import './EditUserForm.css';
import { usersApi } from '../../services/ApiService';
import { ResponseError } from '../../generated';

type EditUserFormSubmitStatus = {
  type: 'success' | 'error' | 'pending';
  message: string;
};

const initialSubmitFormStatus: EditUserFormSubmitStatus = {
  type: 'pending',
  message: '',
};

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
  const [status, setStatus] = useState<EditUserFormSubmitStatus>(
    initialSubmitFormStatus,
  );

  async function updateData() {
    try {
      await usersApi.userControllerUpdateCurrentUser({
        updateUserDto: { username, fullName, email },
      });
      setStatus({ type: 'success', message: 'Update successfully' });
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error.response.status === 400) {
          setStatus({ type: 'error', message: 'Invalid or missing fields' });
        } else if (error.response.status === 422) {
          setStatus({ type: 'error', message: 'Username already exists' });
        } else {
          setStatus({ type: 'error', message: `${error.response.statusText}` });
        }
      } else if (error instanceof Error) {
        setStatus({ type: 'error', message: `${error.message}` });
      }
    }
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateData();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(initialSubmitFormStatus);
    }, 5000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <>
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
          <Text
            variant={TextVariant.PARAGRAPH}
            color={
              status.type === 'success' ? TextColor.ONLINE : TextColor.OFFLINE
            }
          >
            {status.message}
          </Text>
        </div>
      </form>
      <div className="edit-user-form-button">
        <Button
          form="edit-user-form"
          children="Save"
          variant={ButtonVariant.SUBMIT}
        />
      </div>
    </>
  );
}
