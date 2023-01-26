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
        children: 'No',
        variant: ButtonVariant.WARNING,
        buttonSize: ButtonSize.CHIP,
        onClick: () => {},
      },
    ],
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
        click me to see an alert
      </Button>
    </BookSubsection>
  </BookSection>
);
