import {
  Button,
  ButtonVariant,
  Icon,
  IconSize,
  IconVariant,
  Status,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
  SmallAvatar,
  LargeAvatar,
  NavigationBar,
  Row,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  const buttonAction = (): void => alert('This is an alert');
  const buttonLink = (): void => {
    window.location.href = 'http://google.com';
  };

  const randomAvatar = 'https://i.pravatar.cc/1000';
  return (
    <section className="landing">
      <NavigationBar />
      <Text
        variant={TextVariant.TITLE}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        Landing 🚀
      </Text>
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
      <Icon
        variant={IconVariant.PLAY}
        color={Color.ONLINE}
        size={IconSize.LARGE}
      />
      <Status variant="playing" />
      <SmallAvatar url={randomAvatar} />
      <LargeAvatar url={randomAvatar} />
      <SmallAvatar url={randomAvatar} status="offline" />
      <LargeAvatar url={randomAvatar} edit status="online" caption="level 21" />
      <SmallAvatar url={randomAvatar} status="playing" />
      <LargeAvatar
        url={randomAvatar}
        edit
        status="playing"
        caption="level 21"
      />
      <Row
        iconVariant={IconVariant.ARROW_FORWARD}
        avatar={<SmallAvatar url={randomAvatar} status="offline" />}
        onClick={buttonAction}
        title="John Doe"
        subtitle="level 3"
      />
    </section>
  );
}
