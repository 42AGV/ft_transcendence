import { Link } from 'react-router-dom';
import { Color } from '../../types';
import { AvatarProps, MediumAvatar } from '../Avatar/Avatar';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './Header.css';
import { ButtonProps } from '../Button/Button';
import { Button } from '../index';
import React from 'react';

type HeaderCommon = {
  statusVariant?: StatusVariant;
  buttonProps?: ButtonProps;
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
  buttonProps,
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
  let statusElement: JSX.Element | undefined = undefined;
  if (statusVariant) {
    if (statusVariant !== 'button') {
      statusElement = (
        <div className="header-status">
          {statusVariant && <Status variant={statusVariant} />}
        </div>
      );
    } else {
      if (buttonProps !== undefined) {
        statusElement = (
          <div className="header-buttons">
            <Button {...buttonProps} />
          </div>
        );
      }
    }
  }
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
      {statusElement && statusElement}
    </header>
  );
}
