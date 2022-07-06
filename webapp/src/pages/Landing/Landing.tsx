import {
  Icon,
  IconSize,
  IconVariant,
  NavigationItem,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  return (
    <section className="landing">
      <Icon
        variant={IconVariant.PLAY}
        color={Color.ONLINE}
        size={IconSize.LARGE}
      />
      <Text
        variant={TextVariant.TITLE}
        color={TextColor.GAME}
        weight={TextWeight.MEDIUM}
      >
        Landing 🚀
      </Text>
      <NavigationItem
        icon={<Icon variant={IconVariant.USERS} size={IconSize.SMALL} />}
        title="Users"
        urlNavigation="/users"
      />
    </section>
  );
}
