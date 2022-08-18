import { useState } from 'react';
import { Button, ButtonVariant, Input, InputVariant } from '../';
import './EditUserForm.css';

type EditUserProps = {
  origFullName: string;
  origEmail: string;
};

export default function EditUserForm({
  origFullName,
  origEmail,
}: EditUserProps) {
  const [fullName, setFullName] = useState(origFullName);
  const [email, setEmail] = useState(origEmail);

  async function updateData() {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
      }),
    };
    await fetch('http://localhost:3000/api/v1/users', requestOptions);
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let txt;
    if (
      window.confirm(
        `Your name: "${fullName}" and your email: "${email}".\n
        Is this correct?`,
      )
    ) {
      txt = 'Your data has been saved';
      updateData();
    } else {
      txt = 'Canceled!';
    }
    alert(txt);
  };
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
      </form>
      <div className="edit-user-form-button">
        <Button
          form="edit-user-form"
          children="Save"
          variant={ButtonVariant.SUBMIT}
        ></Button>
      </div>
    </>
  );
}
