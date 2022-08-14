import { IconVariant, Row } from '../../../shared/components';
import { BookSection, BookSubsection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';
const buttonAction = (): void => alert('This is an alert');

export const RowExample = () => (
  <BookSection title="Row component" displayVertical>
    <BookSubsection title="All props">
      <Row
        iconVariant={IconVariant.ARROW_FORWARD}
        avatarProps={{ url: randomAvatar, status: 'playing' }}
        onClick={buttonAction}
        title="John Doe"
        subtitle="level 3"
      />
    </BookSubsection>
    <BookSubsection title="Only title and icon configured">
      <Row
        iconVariant={IconVariant.EDIT}
        onClick={buttonAction}
        title="Edit profile"
      />
    </BookSubsection>
    <BookSubsection title="Only title and icon configured, no action">
      <Row iconVariant={IconVariant.EDIT} title="Edit profile" />
    </BookSubsection>
    <BookSubsection title="All props, as a link">
      <Row
        iconVariant={IconVariant.ARROW_FORWARD}
        avatarProps={{ url: randomAvatar, status: 'playing' }}
        url="/"
        title="John Doe"
        subtitle="level 3"
      />
    </BookSubsection>
  </BookSection>
);
