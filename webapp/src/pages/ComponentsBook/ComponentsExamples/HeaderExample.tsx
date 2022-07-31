import { Header, IconVariant } from '../../../shared/components';
import { BookSection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';
const placeholderTitle = 'Header title';

export const HeaderExample = () => (
  <BookSection title="Header component" displayVertical>
    <Header
      navigationFigure={IconVariant.ARROW_BACK}
      navigationUrl="/"
      statusVariant="online"
    >
      {placeholderTitle}
    </Header>
    <Header
      navigationFigure={randomAvatar}
      navigationUrl="/"
      statusVariant="playing"
    >
      {placeholderTitle}
    </Header>
    <Header navigationFigure={IconVariant.ARROW_BACK} navigationUrl="/">
      {placeholderTitle}
    </Header>
    <Header navigationFigure={randomAvatar} navigationUrl="/">
      {placeholderTitle}
    </Header>
  </BookSection>
);
