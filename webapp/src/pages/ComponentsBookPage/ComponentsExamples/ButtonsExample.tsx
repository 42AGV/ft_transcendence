import { Button, ButtonVariant, IconVariant } from '../../../shared/components';
import { BookSection, BookSubsection } from '../BookSection';

const buttonLink = (): void => {
  window.location.href = 'http://google.com';
};

const buttonAction = (): void => alert('This is an alert');

export const ButtonsExample = () => (
  <BookSection title="Button component">
    <BookSubsection title="Warning type">
      <Button variant={ButtonVariant.WARNING} onClick={buttonAction}>
        Alert
      </Button>
    </BookSubsection>
    <BookSubsection title="Disabled">
      <Button
        variant={ButtonVariant.WARNING}
        iconVariant={IconVariant.LOGOUT}
        disabled
      >
        Logout
      </Button>
    </BookSubsection>
    <BookSubsection title="Submit type with icon">
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={buttonLink}
      >
        To Google
      </Button>
    </BookSubsection>
    <BookSubsection title="Small warning type">
      <Button variant={ButtonVariant.WARNING} onClick={buttonAction} />
    </BookSubsection>
    <BookSubsection title="Small disabled">
      <Button
        variant={ButtonVariant.WARNING}
        iconVariant={IconVariant.LOGOUT}
        disabled
      />
    </BookSubsection>
    <BookSubsection title="Small submit type with icon">
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={buttonLink}
      />
    </BookSubsection>
  </BookSection>
);
