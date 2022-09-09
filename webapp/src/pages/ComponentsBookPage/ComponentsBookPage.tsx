import {
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import './ComponentsBookPage.css';
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
  HeaderExample,
  LoadingExample,
} from './ComponentsExamples';
import { EditableAvatarExample } from './ComponentsExamples/EditableAvatarExample';

export default function ComponentsBookPage() {
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
      <EditableAvatarExample />
      <RowExample />
      <RowsListExample />
      <InputExample />
      <LoadingExample />
    </div>
  );
}
