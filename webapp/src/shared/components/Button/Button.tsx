import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Button.css';
import React from 'react';

export enum ButtonVariant {
  SUBMIT = 'submit',
  WARNING = 'warning',
  ALTERNATIVE = 'submit-alternative',
}

type CommonButtonProps = {
  variant: ButtonVariant;
  iconVariant?: IconVariant;
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
}: ButtonProps) {
  return (
    <button
      className={`${
        children ? 'button-large' : 'button-small'
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
      {children && children}
    </button>
  );
}
