import {
  Button,
  ButtonVariant,
  Icon,
  IconSize,
  IconVariant,
  NavigationItem,
  Status,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
  SmallAvatar,
  LargeAvatar
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  const btn_action = (): void => alert('This is an alert');
  const btn_link = (): void => {
    window.location.href = 'http://google.com';
  };

    const randomAvatar = 'https://i.pravatar.cc/1000'
  return (
    <section className="landing">
      <Text
        variant={TextVariant.TITLE}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
      Play online pong with your friends
      </Text>
      <Button variant={ButtonVariant.WARNING} onClick={btn_action}>
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
        onClick={btn_link}
      >
        To Google
      </Button>
      <Icon
        variant={IconVariant.PLAY}
        color={Color.ONLINE}
        size={IconSize.LARGE}
      />
      <NavigationItem
        iconVariant={IconVariant.USERS}
        title="Users"
        urlNavigation="/users"
      />
      <Status variant="playing" />
			<SmallAvatar url={randomAvatar} />
			<LargeAvatar url={randomAvatar} />
			<SmallAvatar url={randomAvatar} status='offline'/>
			<LargeAvatar url={randomAvatar} edit status='online' caption='level 21'/>
			<SmallAvatar url={randomAvatar} status='playing'/>
			<LargeAvatar url={randomAvatar} edit status='playing' caption='level 21'/>
    </section>
  );
}
