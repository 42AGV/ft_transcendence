import { IconVariant, NavigationItem } from '../../shared/components';
import './Users.css';

export default function Users() {
  return (
    <div className="users">
      <NavigationItem
        iconVariant={IconVariant.USERS}
        title="Users"
        urlNavigation="/users"
      />
    </div>
  );
}
