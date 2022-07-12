import { Link } from 'react-router-dom';
import { Color } from '../../types';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import './Header.css';

type HeaderProps = {
  navigation: string;
  urlNavigation: string;
  status?: StatusVariant;
  children: string;
};

export default function Header({
  navigation,
  urlNavigation,
  status,
  children,
}: HeaderProps) {
  console.log(typeof navigation);
  return (
    <header className="header">
      <Link className="header-navigation" to={urlNavigation}>
        {navigation in IconVariant ? (
          <Icon
            variant={navigation as IconVariant}
            size={IconSize.SMALL}
            color={Color.LIGHT}
          />
        ) : (
          <img
            src={navigation}
            alt="avatar"
            width="50px"
            height="50px"
            style={{ borderRadius: '50%' }}
          />
        )}
      </Link>
      <div className="header-text">{children}</div>
      <div className="header-status">
        {status && <Status variant={status} />}
      </div>
    </header>
  );
}
