import './EditableAvatar.css';

import { AvatarProps } from './Avatar';

export function EditableAvatar({ url, XCoordinate, YCoordinate }: AvatarProps) {
  const position =
    XCoordinate && YCoordinate
      ? {
          objectPosition: `${XCoordinate * 1.8}px ${YCoordinate * 1.8}px`,
        }
      : {
          objectPosition: '0 0',
        };
  return (
    <figure className="editable-avatar">
      <img
        src={url}
        alt={url}
        className="editable-avatar__image"
        style={position}
      />
    </figure>
  );
}
