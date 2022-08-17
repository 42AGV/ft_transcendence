import { useState } from 'react';
import { Button, ButtonVariant, Input, InputVariant } from '../';
import './EditUserForm.css';

export default function EditUserForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert(`Your name: "${fullName}" and your email: "${email}" were saved.`);
    setFullName('');
    setEmail('');
  };
  return (
    <form className="edit-user-form" onSubmit={handleOnSubmit}>
      <div className="inputs-container">
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
      <Button children="Save" variant={ButtonVariant.SUBMIT}></Button>
    </form>
  );
}
