import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { AvatarProps, SmallAvatar } from '../Avatar/Avatar';

export type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  avatarProps?: AvatarProps;
  title?: string;
  subtitle?: string;
  key: string;
};

export default function Row({
  iconVariant,
  onClick,
  avatarProps,
  title,
  subtitle,
  key,
}: RowProps) {
  return (
    <button className={`row paragraph-regular`} onClick={onClick} key={key}>
      {avatarProps && <SmallAvatar {...avatarProps} />}
      <div className={`row_text_wrapper`}>
        {title && (
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
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
