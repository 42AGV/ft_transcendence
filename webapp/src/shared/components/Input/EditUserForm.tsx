import { useState } from 'react';
import { Button, ButtonVariant, IconVariant, Input, InputVariant } from '../';
import './EditUserForm.css';

export default function EditUserForm() {
  const [fullName, setfullName] = useState();
  const [email, setEmail] = useState();
  const [inputs, setInputs] = useState();

  const buttonAction = (e: any): void => {
    console.log(
      `Your form: ${e.target.fullName.value} and ${e.target.email.value}`,
    );
  };
  //   const handleSubmit = (e: any) => {
  //     alert(`Your form: ${e.target.fullName.value} and ${e.target.email.value}`);
  //   };
  return (
    <form className="edit-user-form">
      <Input
        variant={InputVariant.LIGHT}
        label="Full Name"
        placeholder="Full Name"
        value={fullName}
        name="fullName"
        onChange={(e: React.ChangeEvent<any>) => setfullName(e.target.value)}
      />
      <Input
        variant={InputVariant.LIGHT}
        label="Email"
        placeholder="Email"
        value={email}
        name="email"
        onChange={(e: React.ChangeEvent<any>) => setEmail(e.target.value)}
      />
      <Input
        variant={InputVariant.DARK}
        label="SEARCH"
        iconVariant={IconVariant.SEARCH}
        placeholder="Search"
        value={inputs}
        onChange={(e: React.ChangeEvent<any>) => setInputs(e.target.value)}
        name="search"
      />
      <Button
        children="Save"
        variant={ButtonVariant.SUBMIT}
        onClick={buttonAction}
      ></Button>
    </form>
  );
}
