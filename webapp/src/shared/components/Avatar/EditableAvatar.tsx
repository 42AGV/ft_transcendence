import './EditableAvatar.css';
import { AvatarProps } from './Avatar';
import { Text, TextColor, TextVariant, TextWeight } from '../index';
import React from 'react';

export const EDITABLE_AVATAR_SCALE = 1.29;
export const EDITABLE_AVATAR_SCALE_REVERSE = 1 / EDITABLE_AVATAR_SCALE;

type EditableAvatarProps = AvatarProps & {
  handleDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  handleMove?: (e: React.MouseEvent | React.TouchEvent) => void;
  handleUp?: (e: React.MouseEvent | React.TouchEvent) => void;
  disabled?: boolean;
};

export default function EditableAvatar({
  url,
  XCoordinate,
  YCoordinate,
  handleDown,
  handleUp,
  handleMove,
  disabled = false,
}: EditableAvatarProps) {
  const FormatNumber = (value: number) =>
    Math.round(value * EDITABLE_AVATAR_SCALE_REVERSE);
  const position = {
    objectPosition: `${FormatNumber(XCoordinate ?? 0)}px ${FormatNumber(
      YCoordinate ?? 0,
    )}px`,
  };
  return (
    <div
      className={`editable-avatar editable-avatar--${
        disabled ? 'disabled' : ''
      }`}
    >
      <Text
        variant={TextVariant.SUBHEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        Edit visible area
      </Text>
      <figure
        className="editable-avatar-wrapper"
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseLeave={handleUp}
        onMouseOut={handleUp}
        onMouseUp={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      >
        <img
          onDragStart={(e) => e.preventDefault()}
          src={url}
          alt={url}
          className="editable-avatar__image"
          style={position}
        />
      </figure>
    </div>
  );
}
