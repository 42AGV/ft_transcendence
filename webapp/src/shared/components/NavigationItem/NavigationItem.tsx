import { NavLink } from 'react-router-dom';
import './NavigationItem.css';

type NavigationItemProps = {
  icon: JSX.Element;
  title: string;
  urlNavigation: string;
};

export default function NavigationItem({
  icon,
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
      {icon}
      {title}
    </NavLink>
  );
}
