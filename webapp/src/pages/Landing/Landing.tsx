import {
  Icon,
  IconSize,
  IconVariant,
  Input,
  InputColor,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  return (
    <section className="Landing">
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
