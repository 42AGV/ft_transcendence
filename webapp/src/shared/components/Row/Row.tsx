import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { SmallAvatar } from '../Avatar/Avatar';
import { StatusVariant } from '../Status/Status';

export type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  avatarUrl?: string;
  avatarStatus?: StatusVariant;
  title?: string;
  subtitle?: string;
};

export default function Row({
  iconVariant,
  onClick,
  avatarUrl,
  avatarStatus,
  title,
  subtitle,
}: RowProps) {
  return (
    <button className={`row paragraph-regular`} onClick={onClick}>
      {avatarUrl && <SmallAvatar url={avatarUrl} status={avatarStatus} />}
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
