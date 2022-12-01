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
  CHIP = 'chip',
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

type ChipButtonProps = CommonButtonProps & {
  children: string;
};

type SmallButtonProps = CommonButtonProps & {
  children?: never;
};

export type ButtonProps = SmallButtonProps | LargeButtonProps | ChipButtonProps;

export default function Button({
  variant,
  iconVariant,
  onClick,
  disabled = false,
  form,
  children,
  buttonSize = ButtonSize.LARGE,
}: ButtonProps) {
  const getButtonSizeClass = () => {
    if (children) {
      switch (buttonSize) {
        case ButtonSize.SMALL:
          return 'button-small';
        case ButtonSize.CHIP:
          return 'button-chip caption-regular';
        default:
          return 'button-large';
      }
    }
    return 'button-small';
  };

  return (
    <button
      className={`${getButtonSizeClass()} button subheading-bold button-${variant}`}
      disabled={disabled}
      onClick={onClick}
      form={form}
    >
      {iconVariant && (
        <div className="button-icon">
          {
            <Icon
              variant={iconVariant}
              size={
                buttonSize === ButtonSize.CHIP
                  ? IconSize.EXTRA_SMALL
                  : IconSize.SMALL
              }
            />
          }
        </div>
      )}
      {children && buttonSize !== ButtonSize.SMALL && children}
    </button>
  );
}
