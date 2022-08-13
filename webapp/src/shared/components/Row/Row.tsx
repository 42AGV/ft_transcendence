import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { AvatarProps, SmallAvatar } from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

export type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  url?: string;
  avatarProps?: AvatarProps;
  title?: string;
  subtitle?: string;
};

export default function Row({
  iconVariant,
  onClick,
  url,
  avatarProps,
  title,
  subtitle,
}: RowProps) {
  const RowChildren: JSX.Element[] = [
    (avatarProps && <SmallAvatar {...avatarProps} />) || <div />,
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
    </div>,
    (iconVariant && (
      <div className="row-icon">
        {<Icon variant={iconVariant} size={IconSize.SMALL} />}
      </div>
    )) || <div />,
  ];
  if (onClick) {
    return (
      <button className={`row paragraph-regular`} onClick={onClick}>
        {RowChildren}
      </button>
    );
  }
  return (
    <Link className={`row paragraph-regular`} to={url ?? '/'}>
      {RowChildren}
    </Link>
  );
}
