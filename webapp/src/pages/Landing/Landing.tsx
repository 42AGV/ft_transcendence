import {
  Button,
  ButtonTypes,
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
      <Button buttonType={ButtonTypes.SUBMIT} action={btn_action}>
        ALERT
      </Button>
      <Button buttonType={ButtonTypes.WARNING} buttonIcon={btn_icon} disabled>
        LOGOUT BUTTON
      </Button>
      <Button
        buttonType={ButtonTypes.SUBMIT}
        buttonIcon={
          <Icon
            type={IconType.ARROW_FORWARD}
            color={Color.DARK}
            size={IconSize.SMALL}
          ></Icon>
        }
        action={btn_link}
      >
        To Google
      </Button>
      <h1 className="text-style-0-bold">Landing 🚀</h1>
    </section>
  );
}
