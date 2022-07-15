import { Link } from 'react-router-dom';
import { Color } from '../../types';
import { SmallAvatar } from '../Avatar/Avatar';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
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
      <div className="header-navigation">
        <Link to={navigationUrl}>
          {navigationFigure in IconVariant ? (
            <Icon
              variant={navigationFigure as IconVariant}
              size={IconSize.SMALL}
              color={Color.LIGHT}
            />
          ) : (
            <SmallAvatar url={navigationFigure} />
          )}
        </Link>
      </div>
      <div className="header-text">
        <Text
          variant={TextVariant.HEADING}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
        >
          {children}
        </Text>
      </div>
      <div className="header-status">
        {statusVariant && <Status variant={statusVariant} />}
      </div>
    </header>
  );
}
