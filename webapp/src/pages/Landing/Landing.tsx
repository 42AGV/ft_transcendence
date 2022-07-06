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
  const btn_icon = (
    <Icon
      variant={IconVariant.LOGOUT}
      color={Color.LIGHT}
      size={IconSize.SMALL}
    ></Icon>
  );
  const btn_action = (): void => alert('This is an alert');
  const btn_link = (): void => {
    window.location.href = 'http://google.com';
  };
  return (
    <section className="Landing">
      <Button variant={ButtonVariant.SUBMIT} onClick={btn_action}>
        ALERT
      </Button>
      <Button variant={ButtonVariant.WARNING} icon={btn_icon} disabled>
        LOGOUT BUTTON
      </Button>
      <Button
        variant={ButtonVariant.SUBMIT}
        icon={
          <Icon
            variant={IconVariant.ARROW_FORWARD}
            color={Color.DARK}
            size={IconSize.SMALL}
          ></Icon>
        }
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
