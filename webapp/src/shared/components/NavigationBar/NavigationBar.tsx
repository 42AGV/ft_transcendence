import { ADMIN_URL, CHATS_URL, PLAY_URL, USERS_URL } from '../../urls';
import { IconVariant } from '../Icon/Icon';
import NavigationItem from '../NavigationItem/NavigationItem';
import './NavigationBar.css';
import { useAuth } from '../../hooks/UseAuth';
import { authApi } from '../../services/ApiService';
import { useCallback, useEffect, useState } from 'react';
import { useData } from '../../hooks/UseData';

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
  const { authUser } = useAuth();
  const getUserWithAuth = useCallback(
    () =>
      authApi.authControllerRetrieveUserWithRoles({
        username: authUser?.username ?? '',
      }),
    [authUser],
  );
  const { data: userWithAuth, isLoading } = useData(getUserWithAuth);
  const [navItems, setNavItems] = useState<NavItemContent[]>(NAV_ITEMS_CONTENT);
  useEffect(() => {
    if (
      !isLoading &&
      userWithAuth &&
      (userWithAuth.gAdmin || userWithAuth.gOwner)
    ) {
      setNavItems([
        ...NAV_ITEMS_CONTENT,
        {
          icon: IconVariant.EDIT,
          title: 'Admin',
          url: ADMIN_URL,
        },
      ]);
    }
  }, [isLoading, userWithAuth]);
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
