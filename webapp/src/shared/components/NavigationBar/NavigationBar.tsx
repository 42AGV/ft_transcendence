import { IconVariant } from '../Icon/Icon';
import NavigationItem from '../NavigationItem/NavigationItem';
import './NavigationBar.css';

type NavigationBarProps = {
  users?: boolean;
  play?: boolean;
  chat?: boolean;
};

export default function NavigationBar({
  users,
  play,
  chat,
}: NavigationBarProps) {
  return (
    <nav className="navigation-bar">
      <ul>
        {users && (
          <li>
            <NavigationItem
              iconVariant={IconVariant.USERS}
              title="Users"
              urlNavigation="/users"
            />
          </li>
        )}
        {play && (
          <li>
            <NavigationItem
              iconVariant={IconVariant.PLAY}
              title="Play"
              urlNavigation="/play"
            />
          </li>
        )}
        {chat && (
          <li>
            <NavigationItem
              iconVariant={IconVariant.CHAT}
              title="Chat"
              urlNavigation="/chat"
            />
          </li>
        )}
      </ul>
    </nav>
  );
}
