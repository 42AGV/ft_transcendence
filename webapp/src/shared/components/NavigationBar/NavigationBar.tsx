import { ADMIN_URL, CHATS_URL, PLAY_URL, FRIENDS_URL } from '../../urls';
import { IconVariant } from '../Icon/Icon';
import NavigationItem from '../NavigationItem/NavigationItem';
import './NavigationBar.css';
import { useAuth } from '../../hooks/UseAuth';
import { useEffect, useState } from 'react';

type NavItemContent = {
  icon: IconVariant;
  title: string;
  url: string;
};

const NAV_ITEMS_CONTENT: NavItemContent[] = [
  {
    icon: IconVariant.USERS,
    title: 'Friends',
    url: FRIENDS_URL,
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
  const { isLoading, authUser } = useAuth();
  const [navItems, setNavItems] = useState<NavItemContent[]>(NAV_ITEMS_CONTENT);
  useEffect(() => {
    if (!isLoading && authUser && (authUser.gAdmin || authUser.gOwner)) {
      setNavItems([
        ...NAV_ITEMS_CONTENT,
        {
          icon: IconVariant.EDIT,
          title: 'Admin',
          url: ADMIN_URL,
        },
      ]);
    }
  }, [isLoading, authUser]);
  return (
    <nav className="navigation-bar">
      <ul>
        {navItems.map((item: NavItemContent) => (
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
