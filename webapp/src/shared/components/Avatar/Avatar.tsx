import './Avatar.css';

import { Icon, IconVariant, IconSize } from '../index';
import { StatusVariant } from '../Status/Status';
import { Color } from '../../types';

type AvatarProps = {
  url: string;
  status?: StatusVariant;
};

type LargeAvatarProps = AvatarProps & {
  edit?: boolean;
  caption?: string;
};

export function SmallAvatar({ url, status }: AvatarProps) {
  return (
    <figure className={`avatar-small__image-wrapper  avatar-status--${status}`}>
      <img src={url} alt={url} className="avatar-small__image" />
    </figure>
  );
}

export function LargeAvatar({
  url,
  status,
  edit = false,
  caption,
}: LargeAvatarProps) {

  const statusClass = status ? `avatar-status--${status}` : '';

  return (
    <figure className="avatar-large">
      {edit && (
        <div className="avatar-large__edit">
          <Icon
            variant={IconVariant.EDIT}
            color={Color.LIGHT}
            size={IconSize.SMALL}
          />
        </div>
      )}
      <div className={`avatar-large__image-wrapper  ${statusClass}`}>
        <img src={url} alt={url} className="avatar-large__image" />
      </div>
      {caption && (
        <figcaption className="avatar-large__caption caption-regular">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
