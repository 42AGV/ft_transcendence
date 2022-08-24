import './EditableAvatar.css';
import { AvatarProps } from './Avatar';
import { Text, TextColor, TextVariant, TextWeight } from '../index';
import React, { useRef } from 'react';
import { Position } from '../../types';

type EditableAvatarProps = AvatarProps & {
  picturePosition: Position;
  setPicturePosition?: React.Dispatch<React.SetStateAction<Position>>;
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

export function EditableAvatar({
  url,
  picturePosition,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
}: EditableAvatarProps) {
  const ref = useRef<HTMLImageElement>(null);
  const factor = 0.6896;
  const FormatNumber = (value: number) => Math.round(value * factor);
  const position = {
    objectPosition: `${FormatNumber(picturePosition?.x)}px ${FormatNumber(
      picturePosition.y,
    )}px`,
  };
  ref?.current?.addEventListener('dragstart', (e) => e.preventDefault());
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
          ref={ref}
          src={url}
          alt={url}
          className="editable-avatar__image"
          style={position}
        />
      </figure>
    </div>
  );
}
