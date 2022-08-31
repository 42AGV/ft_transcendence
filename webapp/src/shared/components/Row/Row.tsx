import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { AvatarProps, SmallAvatar } from '../Avatar/Avatar';
import { Link } from 'react-router-dom';
import React from 'react';

type RowPropsCommon = {
  iconVariant?: IconVariant;
  avatarProps?: AvatarProps;
  title?: string;
  subtitle?: string;
};

type ButtonRowProps = RowPropsCommon & {
  onClick: () => void;
  url?: never;
  onChange?: never;
};

type LinkRowProps = RowPropsCommon & {
  onClick?: never;
  url: string;
  onChange?: never;
};

type NoActionRowProps = RowPropsCommon & {
  onClick?: never;
  url?: never;
  onChange?: never;
};

type FileUploadRowProps = RowPropsCommon & {
  onClick?: never;
  url?: never;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export type RowProps =
  | ButtonRowProps
  | LinkRowProps
  | NoActionRowProps
  | FileUploadRowProps;

export default function Row({
  iconVariant,
  onClick,
  url,
  avatarProps,
  title,
  subtitle,
  onChange,
}: RowProps) {
  const cursorStyle = {
    cursor: 'pointer',
  };
  const RowChildren: JSX.Element = (
    <>
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
          <Icon variant={iconVariant} size={IconSize.SMALL} />
        </div>
      )}
    </>
  );
  return url ? (
    <Link className={`row paragraph-regular`} to={url} style={cursorStyle}>
      {RowChildren}
    </Link>
  ) : onChange ? (
    <>
      <label htmlFor="file-upload" className="row paragraph-regular">
        {RowChildren}
      </label>
      <input
        className="invisible-input"
        id="file-upload"
        type="file"
        onChange={onChange}
      />
    </>
  ) : (
    (onClick && (
      <button
        className={`row paragraph-regular`}
        onClick={onClick}
        style={cursorStyle}
      >
        {RowChildren}
      </button>
    )) || <div className={`row paragraph-regular`}>{RowChildren}</div>
  );
}
