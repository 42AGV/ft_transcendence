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
  RowsListExample,
  InputExample,
  HeaderExample
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
      <HeaderExample />
      <AvatarExample />
      <RowExample />
      <RowsListExample />
      <InputExample />
    </div>
  );
}
