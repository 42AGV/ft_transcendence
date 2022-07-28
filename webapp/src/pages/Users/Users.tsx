import {
  Header,
  IconVariant,
  NavigationBar,
  RowsList,
} from '../../shared/components';
import './Users.css';

export default function Users() {
  const buttonAction = (): void => alert('This is an alert');
  const buttonLink = (): void => {
    window.location.href = 'https://google.com';
  };
  const randomAvatar = 'https://i.pravatar.cc/1000';
  const randomAvatar2 = 'https://i.pravatar.cc/2000';
  const randomAvatar3 = 'https://i.pravatar.cc/3000';
  return (
    <div className="users">
      <div className="users-wrapper">
        <Header
          navigationFigure={IconVariant.ARROW_BACK}
          navigationUrl="/"
          statusVariant="online"
        >
          edit profile
        </Header>
        <Header
          navigationFigure="https://i.pravatar.cc/1000"
          navigationUrl="/"
          statusVariant="playing"
        >
          Lorem ipsum dolor sit amet.
        </Header>
        <Header navigationFigure={IconVariant.ARROW_BACK} navigationUrl="/">
          edit profile
        </Header>
        <Header navigationFigure="https://i.pravatar.cc/1000" navigationUrl="/">
          edit profile
        </Header>
        <RowsList
          rows={[
            {
              iconVariant: IconVariant.ARROW_FORWARD,
              avatarProps: { url: randomAvatar, status: 'online' },
              onClick: buttonAction,
              title: 'John Doe',
              subtitle: 'level 3',
              key: '75442486-0878-440c-9db1-a7006c25a39f',
            },
            {
              iconVariant: IconVariant.ARROW_FORWARD,
              avatarProps: { url: randomAvatar2, status: 'offline' },
              onClick: buttonLink,
              title: 'Jane Doe',
              subtitle: 'level 99',
              key: '99a46451-975e-4d08-a697-9fa9c15f47a6',
            },
            {
              iconVariant: IconVariant.ARROW_FORWARD,
              avatarProps: { url: randomAvatar3, status: 'playing' },
              onClick: buttonAction,
              title: 'Joe Shmoe',
              subtitle: 'level 0',
              key: '5c2013ba-45a0-45b9-b65e-750757df21a0',
            },
          ]}
        />
        <div className="users-nav-container">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
}
