import './Avatar.css';

import { AvatarProps } from './Avatar';

type EditableAvatar = AvatarProps;

export function EditableAvatar({
  url,
  status,
  XCoordinate,
  YCoordinate,
}: EditableAvatar) {
  const statusClass = status ? `avatar-status--${status}` : '';

  const position =
    XCoordinate && YCoordinate
      ? {
          objectPosition: `${XCoordinate}px ${YCoordinate}px`,
        }
      : {
          objectPosition: '0 0',
        };
  return (
    <figure className="avatar-large">
      <div className={`avatar-large__image-wrapper  ${statusClass}`}>
        <img
          src={url}
          alt={url}
          className="avatar-large__image"
          style={position}
        />
      </div>
    </figure>
  );
}
