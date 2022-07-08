import {
  Button,
  ButtonVariant,
  Icon,
  IconSize,
  IconVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  const btn_action = (): void => alert('This is an alert');
  const btn_link = (): void => {
    window.location.href = 'http://google.com';
  };
  return (
    <section className="Landing">
      <Button variant={ButtonVariant.SUBMIT} onClick={btn_action}>
        ALERT
      </Button>
      <Button
        variant={ButtonVariant.WARNING}
        iconVariant={IconVariant.LOGOUT}
        disabled
      >
        LOGOUT BUTTON
      </Button>
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={btn_link}
      >
        To Google
      </Button>
      <Icon
        variant={IconVariant.PLAY}
        color={Color.ONLINE}
        size={IconSize.LARGE}
      ></Icon>
      <Text
        variant={TextVariant.TITLE}
        color={TextColor.GAME}
        weight={TextWeight.MEDIUM}
      >
        Landing 🚀
      </Text>
    </section>
  );
}
