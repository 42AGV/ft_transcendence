import './Avatar.css';

import { Icon, IconVariant, IconSize } from '../index';
import { Color } from '../../../shared/types';

type AvatarStatus = 'online' | 'offline' | 'playing';

type AvatarProps = {
  url: string;
  status?: AvatarStatus;
};

type LargeAvatarProps = AvatarProps & {
  edit?: boolean;
  caption?: string;
};

export function SmallAvatar({ url, status }: AvatarProps) {
  return (
    <div className={`avatar-small__image-wrapper  avatar-status--${status}`}>
      <img src={url} alt={url} className="avatar-small__image" />
    </div>
  );
}

export function LargeAvatar({
  url,
  status,
  edit = false,
  caption,
}: LargeAvatarProps) {
  return (
    <div className="avatar-large">
      {edit && (
        <div className="avatar-large__edit">
          <Icon
            variant={IconVariant.EDIT}
            color={Color.LIGHT}
            size={IconSize.SMALL}
          />
        </div>
      )}
      <div className={`avatar-large__image-wrapper  avatar-status--${status}`}>
        <img src={url} alt={url} className="avatar-large__image" />
      </div>
      {caption && (
        <caption className="avatar-large__caption caption-regular">
          {caption}
        </caption>
      )}
    </div>
  );
}
