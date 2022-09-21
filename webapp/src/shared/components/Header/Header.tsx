import { Link } from 'react-router-dom';
import { Color } from '../../types';
import { AvatarProps, MediumAvatar } from '../Avatar/Avatar';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './Header.css';
import React from 'react';

type HeaderCommon = {
  statusVariant?: StatusVariant;
  children: string;
};

type IconHeader = HeaderCommon & {
  icon: IconVariant;
  avatar?: never;
  navigationUrl?: never;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

type AvatarHeader = HeaderCommon & {
  icon?: never;
  avatar: AvatarProps;
  navigationUrl: string;
  onClick?: never;
};

type NoFigureHeader = HeaderCommon & {
  icon?: never;
  avatar?: never;
  navigationUrl?: never;
  onClick?: never;
};

type HeaderProps = IconHeader | AvatarHeader | NoFigureHeader;

export default function Header({
  icon,
  avatar,
  navigationUrl,
  onClick,
  statusVariant,
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
  return (
    <header className="header">
      <div className="header-navigation">
        {(navigationUrl && <Link to={navigationUrl}>{lNavFigure}</Link>) || (
          <button onClick={onClick}>{lNavFigure}</button>
        )}
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
