import {
  Icon,
  IconSize,
  IconType,
  Text,
  TextColor,
  TextSize,
  TextType,
  TextWeight,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  return (
    <section className="Landing">
      <Icon
        type={IconType.PLAY}
        color={Color.ONLINE}
        size={IconSize.LARGE}
      ></Icon>
      <Text
        type={TextType.HEADER}
        size={TextSize.LARGE}
        color={TextColor.GAME}
        weight={TextWeight.MEDIUM}
      >
        Landing 🚀
      </Text>
    </section>
  );
}
