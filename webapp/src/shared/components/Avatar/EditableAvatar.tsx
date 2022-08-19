import './EditableAvatar.css';

import { AvatarProps } from './Avatar';
import React, { useRef } from 'react';
import useDrag from '../../hooks/UseDrag';
import ReactDOM from 'react-dom';
import { truncate } from 'fs';

export type EditableAvatarProps = AvatarProps;

export function EditableAvatar({ url }: EditableAvatarProps) {
  const ref = useRef<HTMLElement>(null);
  const rect = ref?.current?.getBoundingClientRect();
  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag({ x: 0, y: 0 });
  const factor = 0.8;
  const desiredX =
    Math.round((picturePosition.x - (rect ? rect.x : 0)) * factor * 100) / 100;
  const desiredY =
    Math.round((picturePosition.y - (rect ? rect.y : 0)) * factor * 100) / 100;
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
