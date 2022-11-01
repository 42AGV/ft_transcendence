import { Link } from 'react-router-dom';
import { Color } from '../../types';
import { AvatarProps, MediumAvatar } from '../Avatar/Avatar';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './Header.css';

type HeaderCommon = {
  statusVariant?: StatusVariant;
  children: string;
  titleNavigationUrl?: string;
};

type IconHeader = HeaderCommon & {
  icon: IconVariant;
  avatar?: never;
  iconNavigationUrl?: never;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

type AvatarHeader = HeaderCommon & {
  icon?: never;
  avatar: AvatarProps;
  iconNavigationUrl: string;
  onClick?: never;
};

type NoFigureHeader = HeaderCommon & {
  icon?: never;
  avatar?: never;
  iconNavigationUrl?: never;
  onClick?: never;
};

type HeaderProps = IconHeader | AvatarHeader | NoFigureHeader;

export default function Header({
  icon,
  avatar,
  iconNavigationUrl,
  onClick,
  statusVariant,
  titleNavigationUrl,
  children,
}: HeaderProps) {
  const lNavFigure = (
    <>
      {icon ? (
        <Icon variant={icon} size={IconSize.SMALL} color={Color.LIGHT} />
      ) : (
        avatar && <MediumAvatar {...avatar} />
      )}
    </>
  );
  const headerTitle = (
    <Text
      variant={TextVariant.HEADING}
      color={TextColor.LIGHT}
      weight={TextWeight.BOLD}
    >
      {children}
    </Text>
  );
  return (
    <header className="header">
      <div className="header-navigation">
        {(iconNavigationUrl && (
          <Link to={iconNavigationUrl}>{lNavFigure}</Link>
        )) || <button onClick={onClick}>{lNavFigure}</button>}
      </div>
      <div className="header-text">
        {titleNavigationUrl ? (
          <Link to={titleNavigationUrl}>{headerTitle}</Link>
        ) : (
          <div className="header-text">{headerTitle}</div>
        )}
      </div>
      <div className="header-status">
        {statusVariant && <Status variant={statusVariant} />}
      </div>
    </header>
  );
}
