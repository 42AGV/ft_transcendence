import {
  Button,
  ButtonVariant,
  IconVariant,
} from '../../../shared/components';
import { BookSection } from '../BookSection';

const buttonLink = (): void => {
  window.location.href = 'http://google.com';
};

const buttonAction = (): void => alert('This is an alert');

export const ButtonsExample = () => (
  <BookSection title="Button component">
    <Button variant={ButtonVariant.WARNING} onClick={buttonAction}>
      Alert
    </Button>
    <Button
      variant={ButtonVariant.WARNING}
      iconVariant={IconVariant.LOGOUT}
      disabled
    >
      Logout
    </Button>
    <Button
      variant={ButtonVariant.SUBMIT}
      iconVariant={IconVariant.ARROW_FORWARD}
      onClick={buttonLink}
    >
      To Google
    </Button>
  </BookSection>
);
