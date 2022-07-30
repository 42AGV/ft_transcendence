import { Text, TextColor, TextVariant, TextWeight } from '../../shared/components';
import './ComponentsBook.css';
import {
  NavigationExample,
  TextExample,
  ButtonsExample,
  StatusExample,
  IconExample,
  AvatarExample,
  RowExample,
  InputExample,
} from './ComponentsExamples';

export default function ComponentsBook() {
  return (
    <div className="components-book">
      <Text
        variant={TextVariant.TITLE}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        🎨 Components Book
      </Text>
      <IconExample />
      <TextExample />
      <StatusExample />
      <ButtonsExample />
      <NavigationExample />
      <AvatarExample />
      <RowExample />
      <InputExample />
    </div>
  );
}
