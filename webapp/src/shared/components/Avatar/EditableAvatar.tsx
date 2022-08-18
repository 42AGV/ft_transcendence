import './EditableAvatar.css';

import { AvatarProps } from './Avatar';
import React from 'react';

export type EditableAvatarProps = AvatarProps & {
  handleMouseDown: (a: React.MouseEvent) => void;
  handleMouseMove: (a: React.MouseEvent) => void;
  handleMouseUp: () => void;
};

export function EditableAvatar({
  url,
  XCoordinate,
  YCoordinate,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: EditableAvatarProps) {
  // console.log(XCoordinate);
  // console.log(YCoordinate);
  const position =
    XCoordinate && YCoordinate
      ? {
          objectPosition: `${XCoordinate * 1.8}px ${YCoordinate * 1.8}px`,
        }
      : {
          objectPosition: '0 0',
        };
  return (
    <figure
      className="editable-avatar"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        src={url}
        alt={url}
        className="editable-avatar__image"
        style={position}
      />
    </figure>
  );
}
