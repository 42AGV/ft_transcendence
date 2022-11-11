import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Button.css';
import React from 'react';

export enum ButtonVariant {
  SUBMIT = 'submit',
  WARNING = 'warning',
  ALTERNATIVE = 'submit-alternative',
}

export enum ButtonSize {
  SMALL = 'small',
  LARGE = 'large',
}

type CommonButtonProps = {
  variant: ButtonVariant;
  iconVariant?: IconVariant;
  buttonSize?: ButtonSize;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  form?: string;
};

type LargeButtonProps = CommonButtonProps & {
  children: string;
};

type SmallButtonProps = CommonButtonProps & {
  children?: never;
};

export type ButtonProps = SmallButtonProps | LargeButtonProps;

export default function Button({
  variant,
  iconVariant,
  onClick,
  disabled = false,
  form,
  children,
  buttonSize = ButtonSize.LARGE,
}: ButtonProps) {
  return (
    <button
      className={`${
        children && buttonSize === ButtonSize.LARGE
          ? 'button-large'
          : 'button-small'
      } button subheading-bold button-${variant}`}
      disabled={disabled}
      onClick={onClick}
      form={form}
    >
      {iconVariant && (
        <div className="button-icon">
          {<Icon variant={iconVariant} size={IconSize.SMALL} />}
        </div>
      )}
      {children && buttonSize === ButtonSize.LARGE && children}
    </button>
  );
}
