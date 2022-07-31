import { useState } from 'react';
import { Button, ButtonVariant, Input, InputVariant } from '../';
import './EditUserForm.css';

export default function EditUserForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const buttonAction = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert(`Your name: "${fullName}" and your email: "${email}" were saved.`);
  };
  return (
    <form className="edit-user-form" onSubmit={buttonAction}>
      <Input
        variant={InputVariant.LIGHT}
        label="Full Name"
        placeholder="Full Name"
        value={fullName}
        name="fullName"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFullName(e.target.value);
        }}
      />
      <Input
        variant={InputVariant.LIGHT}
        label="Email"
        placeholder="Email"
        value={email}
        name="email"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        }}
      />
      <Button children="Save" variant={ButtonVariant.SUBMIT}></Button>
    </form>
  );
}
