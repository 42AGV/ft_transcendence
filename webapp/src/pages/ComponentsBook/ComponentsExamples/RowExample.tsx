import {
  IconVariant,
  Row,
} from '../../../shared/components';
import { BookSection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';
const buttonAction = (): void => alert('This is an alert');

export const RowExample = () => (
  <BookSection title="Row component">
    <Row
      iconVariant={IconVariant.ARROW_FORWARD}
      avatarProps={{ url: randomAvatar, status: 'playing' }}
      onClick={buttonAction}
      title="John Doe"
      subtitle="level 3"
    />
  </BookSection>
);
