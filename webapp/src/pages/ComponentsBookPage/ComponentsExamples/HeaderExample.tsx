import { Header, IconVariant } from '../../../shared/components';
import { BookSection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';
const avProps = { url: randomAvatar };
const placeholderTitle = 'Header title';
const buttonAction = (): void => alert('This is an alert');

export const HeaderExample = () => (
  <BookSection title="Header component" displayVertical>
    <Header
      icon={IconVariant.ARROW_BACK}
      onClick={buttonAction}
      statusVariant="online"
    >
      {placeholderTitle}
    </Header>
    <Header avatar={avProps} navigationUrl="/" statusVariant="playing">
      {placeholderTitle}
    </Header>
    <Header icon={IconVariant.ARROW_BACK} onClick={buttonAction}>
      {placeholderTitle}
    </Header>
    <Header avatar={avProps} navigationUrl="/" statusVariant="playing">
      {placeholderTitle}
    </Header>
  </BookSection>
);
