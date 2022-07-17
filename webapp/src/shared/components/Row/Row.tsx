import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import { SmallAvatar, AvatarProps } from '../Avatar/Avatar';
import { TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';

export type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  avatarProps?: AvatarProps;
  title?: string;
  subtitle?: string;
};

export default function Row({
  iconVariant,
  onClick,
  avatarProps,
  title,
  subtitle,
}: RowProps) {
  return (
    <button className={`row paragraph-regular`} onClick={onClick}>
      {avatarProps && <SmallAvatar {...avatarProps} />}
      <div className={`row_text_wrapper`}>
        {title && (
          <Text
            variant={TextVariant.PARAGRAPH}
            weight={TextWeight.MEDIUM}
            parent_class="row_text_wrapper"
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            variant={TextVariant.CAPTION}
            weight={TextWeight.REGULAR}
            parent_class="row_text_wrapper"
          >
            {subtitle}
          </Text>
        )}
      </div>
      {iconVariant && (
        <div className="row-icon">
          {<Icon variant={iconVariant} size={IconSize.SMALL} />}
        </div>
      )}
    </button>
  );
}
