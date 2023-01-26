import {
  ButtonSize,
  ButtonVariant,
  CustomConfirmAlert,
  Button,
  IconVariant,
} from '../../../shared/components';
import { BookSection, BookSubsection } from '../BookSection';

const buttonAction = async () => {
  CustomConfirmAlert({
    title: 'Do something',
    message: 'Are you sure you want to do this?',
    buttons: [
      {
        children: 'Yes',
        variant: ButtonVariant.SUBMIT,
        buttonSize: ButtonSize.CHIP,
        onClick: () => {},
      },
      {
        children: 'Nnoooo',
        variant: ButtonVariant.WARNING,
        buttonSize: ButtonSize.CHIP,
        onClick: () => {},
      },
    ],
  });
};

const buttonActionTwo = async () => {
  CustomConfirmAlert({
    message: 'Are you sure you want to do this default?',
    buttons: [{}, {}],
  });
};

export const CustomConfirmAlertExample = () => (
  <BookSection title="Custom confirm alert">
    <BookSubsection title="regular alert">
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={buttonAction}
      >
        regular alert
      </Button>
    </BookSubsection>
    <BookSubsection title="all defaults">
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={buttonActionTwo}
      >
        very brief alert
      </Button>
    </BookSubsection>
  </BookSection>
);
