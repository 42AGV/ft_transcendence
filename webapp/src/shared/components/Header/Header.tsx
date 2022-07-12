import { Link } from 'react-router-dom';
import { Color } from '../../types';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import './Header.css';

type HeaderProps = {
  navigationFigure: string;
  navigationUrl: string;
  statusVariant?: StatusVariant;
  children: string;
};

export default function Header({
  navigationFigure,
  navigationUrl,
  statusVariant,
  children,
}: HeaderProps) {
  return (
    <header className="header">
      <Link className="header-navigation" to={navigationUrl}>
        {navigationFigure in IconVariant ? (
          <Icon
            variant={navigationFigure as IconVariant}
            size={IconSize.SMALL}
            color={Color.LIGHT}
          />
        ) : (
          <img
            src={navigationFigure}
            alt="avatar"
            width="50px"
            height="50px"
            style={{ borderRadius: '50%' }}
          />
        )}
      </Link>
      <div className="header-text">{children}</div>
      <div className="header-status">
        {statusVariant && <Status variant={statusVariant} />}
      </div>
    </header>
  );
}
