import { CHATS_URL, PLAY_URL, USERS_URL } from '../../urls';
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
    url: USERS_URL,
  },
  {
    icon: IconVariant.PLAY,
    title: 'Play',
    url: PLAY_URL,
  },
  {
    icon: IconVariant.CHAT,
    title: 'Chat',
    url: CHATS_URL,
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
