import { NavLink } from 'react-router-dom';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import './NavigationItem.css';

type NavigationItemProps = {
  iconVariant: IconVariant;
  title: string;
  urlNavigation: string;
};

export default function NavigationItem({
  iconVariant,
  title,
  urlNavigation,
}: NavigationItemProps) {
  const className = 'navigation-item caption-regular';

  return (
    <NavLink
      to={urlNavigation}
      className={({ isActive }) =>
        isActive ? `${className} color-submit` : `${className} color-light`
      }
    >
      <Icon variant={iconVariant} size={IconSize.SMALL} />
      {title}
    </NavLink>
  );
}
