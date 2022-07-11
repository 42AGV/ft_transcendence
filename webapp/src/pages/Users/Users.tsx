import { Header, IconVariant, NavigationItem } from '../../shared/components';
import './Users.css';

export default function Users() {
  return (
    <div className="users">
      <div className="users-wrapper">
        <Header
          navigation={IconVariant.ARROW_BACK}
          urlNavigation="/"
          status="online"
        >
          edit profile
        </Header>
        <Header
          navigation="https://i.pravatar.cc/1000"
          urlNavigation="/"
          status="playing"
        >
          edit profile
        </Header>
        <Header navigation={IconVariant.ARROW_BACK} urlNavigation="/">
          edit profile
        </Header>
        <Header navigation="https://i.pravatar.cc/1000" urlNavigation="/">
          edit profile
        </Header>
        <NavigationItem
          iconVariant={IconVariant.USERS}
          title="Users"
          urlNavigation="/users"
        />
      </div>
    </div>
  );
}
