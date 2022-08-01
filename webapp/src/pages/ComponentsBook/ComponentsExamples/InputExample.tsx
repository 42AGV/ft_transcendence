import {
  Input,
  InputVariant,
} from '../../../shared/components';
import { BookSection } from '../BookSection';

export const InputExample = () => (
  <BookSection title='Input component'>
    <Input
      variant={InputVariant.LIGHT}
      label="Light Input"
      placeholder="Your email"
    />
  </BookSection>
);
