import {
  Icon,
  IconSize,
  IconVariant,
  Input,
  InputColor,
  Text,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  return (
    <section className="Landing">
      <Input
        color={InputColor.DARK}
        label="My Label"
        iconVariant={IconVariant.SEARCH}
        input="Placeholder"
      />
      <Input
        color={InputColor.LIGHT}
        label="My Label"
        iconVariant={IconVariant.SEARCH}
        input="Placeholder"
      />
      <Text
        variant={TextVariant.TITLE}
        color={Color.LIGHT}
        weight={TextWeight.MEDIUM}
      >
        Landing 🚀
      </Text>
    </section>
  );
}
