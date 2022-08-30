import './EditableAvatar.css';
import { AvatarProps } from './Avatar';
import { Text, TextColor, TextVariant, TextWeight } from '../index';
import React from 'react';
import { EDITABLE_AVATAR_SCALE_REVERSE } from '../../../pages/EditAvatarPage/EditAvatarPage';

type EditableAvatarProps = AvatarProps & {
  handleMouseDown?: ({
    clientX,
    clientY,
  }: React.MouseEvent<Element, MouseEvent>) => void;
  handleMouseMove?: ({
    clientX,
    clientY,
  }: React.MouseEvent<Element, MouseEvent>) => void;
  handleMouseUp?: ({
    clientX,
    clientY,
  }: React.MouseEvent<Element, MouseEvent>) => void;
};

export default function EditableAvatar({
  imgHash = '',
  url,
  XCoordinate,
  YCoordinate,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
}: EditableAvatarProps) {
  const FormatNumber = (value: number) =>
    Math.round(value * EDITABLE_AVATAR_SCALE_REVERSE);
  const position = {
    objectPosition: `${FormatNumber(XCoordinate ?? 0)}px ${FormatNumber(
      YCoordinate ?? 0,
    )}px`,
  };
  return (
    <div className="editable-avatar">
      <Text
        variant={TextVariant.SUBHEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        Edit visible area
      </Text>
      <figure
        className="editable-avatar-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseMove}
        onMouseOut={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        <img
          onDragStart={(e) => e.preventDefault()}
          src={`${url}?${imgHash}`}
          alt={url}
          className="editable-avatar__image"
          style={position}
        />
      </figure>
    </div>
  );
}
