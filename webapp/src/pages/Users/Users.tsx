import {
  Icon,
  IconSize,
  IconVariant,
  NavigationItem,
} from '../../shared/components';
import './Users.css';

export default function Users() {
  return (
    <div className="users">
      <NavigationItem
        icon={<Icon variant={IconVariant.USERS} size={IconSize.SMALL} />}
        title="Users"
        urlNavigation="/users"
      />
    </div>
  );
}
