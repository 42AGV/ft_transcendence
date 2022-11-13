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
import { useMediaQuery } from '../../hooks/UseMediaQuery';

type HeaderCommon = {
  statusVariant?: StatusVariant;
  buttonProps?: ButtonProps[];
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

export const calcDownwardsDisplacement = (len: number): number => {
  switch (len) {
    case 0:
      return 0;
    case 1:
      return 0;
    case 2:
      return 30;
    case 3:
      return 34;
    case 4:
      return 38;
    default:
    case 5:
      return 43;
  }
};

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
  const windowIsBig = useMediaQuery(768);
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
  let style: React.CSSProperties | undefined;
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
        if (!windowIsBig) {
          style = {
            transform: `translateY(${calcDownwardsDisplacement(
              buttonProps.length,
            )}%)`,
          };
        }
        statusElement = (
          <div className="header-buttons" style={style}>
            {buttonProps.map((buttonProp, idx) => (
              <Button key={idx} {...buttonProp} />
            ))}
          </div>
        );
      }
    }
  }
  return (
    <header
      className="header"
      style={{
        transform: `translateY(-${calcDownwardsDisplacement(
          buttonProps?.length && !windowIsBig ? buttonProps?.length : 0,
        )}%)`,
      }}
    >
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
