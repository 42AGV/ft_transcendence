import {
  Text,
  TextVariant,
  TextWeight,
  TextColor,
} from '../../../shared/components';
import { BookSection } from '../BookSection';

export const TextExample = () => (
  <BookSection title="Text component">
    <Text
      variant={TextVariant.TITLE}
      color={TextColor.LIGHT}
      weight={TextWeight.BOLD}
    >
      This is a title
    </Text>
    <Text
      variant={TextVariant.SUBTITLE}
      color={TextColor.LIGHT}
      weight={TextWeight.BOLD}
    >
      This is a subtitle
    </Text>
    <Text
      variant={TextVariant.HEADING}
      color={TextColor.LIGHT}
      weight={TextWeight.BOLD}
    >
      This is a heading
    </Text>
  </BookSection>
);
