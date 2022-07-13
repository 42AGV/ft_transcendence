import { IconVariant } from '../Icon/Icon';
import NavigationItem from '../NavigationItem/NavigationItem';
import './NavigationBar.css';

type NavItemContent = {
  icon: IconVariant;
  title: string;
  url: string;
};

const NAV_ITEMS_CONTENT: NavItemContent[] = [
  {
    icon: IconVariant.USERS,
    title: 'Users',
    url: '/users',
  },
  {
    icon: IconVariant.PLAY,
    title: 'Play',
    url: '/play',
  },
  {
    icon: IconVariant.CHAT,
    title: 'Chat',
    url: '/chat',
  },
];

export default function NavigationBar() {
  return (
    <nav className="navigation-bar">
      <ul>
        {NAV_ITEMS_CONTENT.map((item: NavItemContent) => (
          <li key={item.title}>
            <NavigationItem
              iconVariant={item.icon}
              title={item.title}
              urlNavigation={item.url}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
