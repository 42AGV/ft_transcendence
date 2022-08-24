import './EditableAvatar.css';
import { AvatarProps } from './Avatar';
import useDrag from '../../hooks/UseDrag';
import { Text, TextColor, TextVariant, TextWeight } from '../index';
import React, { useEffect, useRef } from 'react';
import { Position } from '../../types';

type EditableAvatarProps = AvatarProps & {
  setPicturePosition?: React.Dispatch<React.SetStateAction<Position>>;
};

export function EditableAvatar({
  url,
  XCoordinate,
  YCoordinate,
  setPicturePosition,
}: EditableAvatarProps) {
  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag({ x: XCoordinate ?? 0, y: YCoordinate ?? 0 });
  const ref = useRef<HTMLImageElement>(null);
  const factor = 0.6896;
  const FormatNumber = (value: number) => Math.round(value * factor);
  const position = {
    objectPosition: `${FormatNumber(picturePosition?.x)}px ${FormatNumber(
      picturePosition.y,
    )}px`,
  };
  useEffect(() => {
    setPicturePosition &&
      setPicturePosition({
        x: picturePosition.x,
        y: picturePosition.y,
      });
  }, [picturePosition]);
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
