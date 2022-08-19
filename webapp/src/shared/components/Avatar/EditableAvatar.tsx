import './EditableAvatar.css';

import { AvatarProps } from './Avatar';
import React, { useRef } from 'react';
import useDrag from '../../hooks/UseDrag';
import ReactDOM from 'react-dom';
import { truncate } from 'fs';

export type Position = {
  x: number;
  y: number;
};
export type EditableAvatarProps = AvatarProps;

export function EditableAvatar({ url }: EditableAvatarProps) {
  const { innerHeight, innerWidth } = window;
  const ref = useRef<HTMLElement>(null);
  const rect = ref?.current?.getBoundingClientRect();
  const startingPosition = {
    x: innerWidth / 2 - 160,
    y: innerHeight / 2 - 160,
  };
  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag(startingPosition);
  const factor = 0.8;
  const desiredX = Math.round(-picturePosition.x * factor * 100) / 100;
  const desiredY = Math.round(-picturePosition.y * factor * 100) / 100;
  const position = {
    objectPosition: `${desiredX}px ${desiredY}px`,
  };
  console.log(ref);
  console.log(position);
  console.log(`ref.current: ${ref?.current}`);
  console.log(`x: ${picturePosition.x}`);
  console.log(`y: ${picturePosition.y}`);
  return (
    <figure
      className="editable-avatar"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={ref}
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
