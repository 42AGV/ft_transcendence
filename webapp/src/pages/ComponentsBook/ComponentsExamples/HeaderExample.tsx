import { Header, IconVariant } from '../../../shared/components';
import { BookSection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';
const avProps = { url: randomAvatar };
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
      navigationFigure={JSON.stringify(avProps)}
      navigationUrl="/"
      statusVariant="playing"
    >
      {placeholderTitle}
    </Header>
    <Header navigationFigure={IconVariant.ARROW_BACK} navigationUrl="/">
      {placeholderTitle}
    </Header>
    <Header navigationFigure={JSON.stringify(avProps)} navigationUrl="/">
      {placeholderTitle}
    </Header>
  </BookSection>
);
