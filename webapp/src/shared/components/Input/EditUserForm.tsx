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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let txt;
    if (
      confirm(
        `Your name: "${fullName}" and your email: "${email}".\n
        Is this correct?`,
      )
    ) {
      txt = 'You pressed OK!';
    } else {
      txt = 'You pressed CANCEL!';
    }
    alert(txt);
    setFullName('');
    setEmail('');
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
