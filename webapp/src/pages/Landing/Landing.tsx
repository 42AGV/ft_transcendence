import {
  Button,
  ButtonVariant,
  Icon,
  IconSize,
  IconType,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  const btn_icon = (
    <Icon
      type={IconType.LOGOUT}
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
            type={IconType.ARROW_FORWARD}
            color={Color.DARK}
            size={IconSize.SMALL}
          ></Icon>
        }
        onClick={btn_link}
      >
        To Google
      </Button>
      <h1 className="text-style-0-bold">Landing 🚀</h1>
    </section>
  );
}
