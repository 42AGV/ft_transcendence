import './Avatar.css';

import { Icon, IconVariant, IconSize } from '../index';
import { StatusVariant } from '../Status/Status';
import { Color } from '../../types';
import { Link } from 'react-router-dom';

export type AvatarProps = {
  url: string;
  imgHash?: number;
  status?: StatusVariant;
  XCoordinate?: number;
  YCoordinate?: number;
};

type LargeAvatarProps = AvatarProps & {
  edit?: boolean;
  caption?: string;
  editUrl?: string;
};

const SMALL_AVATAR_DOWNSCALE = 0.139;
const LARGE_AVATAR_DOWNSCALE = 0.55;

export function SmallAvatar({
  url,
  status,
  XCoordinate,
  YCoordinate,
}: AvatarProps) {
  const FormatNumber = (value: number) =>
    Math.round(value * SMALL_AVATAR_DOWNSCALE);
  const position =
    XCoordinate && YCoordinate
      ? {
          objectPosition: `${FormatNumber(XCoordinate)}px ${FormatNumber(
            YCoordinate,
          )}px`,
        }
      : {
          objectPosition: '0 0',
        };
  return (
    <div className="avatar-small">
      <figure
        className={`avatar-small__image-wrapper  avatar-status--${status}`}
      >
        <img
          src={url}
          alt={url}
          className="avatar-small__image"
          style={position}
        />
      </figure>
    </div>
  );
}

export function LargeAvatar({
  url,
  status,
  edit = false,
  caption,
  XCoordinate,
  YCoordinate,
  editUrl,
}: LargeAvatarProps) {
  const FormatNumber = (value: number) =>
    Math.round(value * LARGE_AVATAR_DOWNSCALE);
  const statusClass = status ? `avatar-status--${status}` : '';

  const position =
    XCoordinate && YCoordinate
      ? {
          objectPosition: `${FormatNumber(XCoordinate)}px ${FormatNumber(
            YCoordinate,
          )}px`,
        }
      : {
          objectPosition: '0 0',
        };
  return (
    <figure className="avatar-large">
      {edit && (
        <div className="avatar-large__edit">
          {(editUrl && (
            <Link to={editUrl}>
              <Icon
                variant={IconVariant.EDIT}
                color={Color.LIGHT}
                size={IconSize.SMALL}
              />
            </Link>
          )) || (
            <Icon
              variant={IconVariant.EDIT}
              color={Color.LIGHT}
              size={IconSize.SMALL}
            />
          )}
        </div>
      )}
      <div className={`avatar-large__image-wrapper  ${statusClass}`}>
        <img
          src={url}
          alt={url}
          className="avatar-large__image"
          style={position}
        />
      </div>
      {caption && (
        <figcaption className="avatar-large__caption caption-regular">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
