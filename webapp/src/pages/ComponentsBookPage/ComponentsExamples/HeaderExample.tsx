import { ButtonVariant, Header, IconVariant } from '../../../shared/components';
import { HOST_URL } from '../../../shared/urls';
import { BookSection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';
const avProps = { url: randomAvatar };
const placeholderTitle = 'Header title';
const buttonAction = (): void => alert('This is an alert');
const buttonLink = (): void => {
  window.location.href = 'http://google.com';
};

export const HeaderExample = () => (
  <BookSection title="Header component" displayVertical>
    <Header
      icon={IconVariant.ARROW_BACK}
      onClick={buttonAction}
      statusVariant="online"
      titleNavigationUrl={HOST_URL}
    >
      {placeholderTitle}
    </Header>
    <Header
      avatar={avProps}
      iconNavigationUrl="/"
      statusVariant="playing"
      titleNavigationUrl={HOST_URL}
    >
      {placeholderTitle}
    </Header>
    <Header icon={IconVariant.ARROW_BACK} onClick={buttonAction}>
      {placeholderTitle}
    </Header>
    <Header avatar={avProps} iconNavigationUrl="/" statusVariant="playing">
      {placeholderTitle}
    </Header>
    <Header
      avatar={avProps}
      iconNavigationUrl="/"
      statusVariant="button"
      buttonProps={[
        {
          variant: ButtonVariant.SUBMIT,
          iconVariant: IconVariant.ARROW_FORWARD,
          onClick: buttonLink,
        },
        {
          variant: ButtonVariant.WARNING,
          iconVariant: IconVariant.LOGOUT,
          onClick: buttonLink,
        },
      ]}
    >
      {placeholderTitle}
    </Header>
  </BookSection>
);
