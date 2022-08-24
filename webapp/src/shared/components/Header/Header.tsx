import { Link } from 'react-router-dom';
import { Color } from '../../types';
import { AvatarProps, SmallAvatar } from '../Avatar/Avatar';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import Status, { StatusVariant } from '../Status/Status';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './Header.css';
import React from 'react';

type HeaderCommon = {
  navigationFigure: IconVariant | string;
  statusVariant?: StatusVariant;
  children: string;
};

type HeaderLinkProps = HeaderCommon & {
  navigationUrl: string;
  onClick?: never;
};

type HeaderButtonProps = HeaderCommon & {
  navigationUrl?: never;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

type HeaderProps = HeaderLinkProps | HeaderButtonProps;

export default function Header({
  navigationFigure,
  navigationUrl,
  onClick,
  statusVariant,
  children,
}: HeaderProps) {
  const lNavFigure = (
    <>
      {navigationFigure in IconVariant ? (
        <Icon
          variant={navigationFigure as IconVariant}
          size={IconSize.SMALL}
          color={Color.LIGHT}
        />
      ) : (
        <SmallAvatar {...(JSON.parse(navigationFigure) as AvatarProps)} />
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
