import { ReactNode } from 'react';
import './Button.css';

export enum ButtonTypes {
  SUBMIT = 'submit',
  WARNING = 'warning',
}

type Buttonprops = {
  buttonType: ButtonTypes;
  buttonIcon?: JSX.Element;
  action?: () => void;
  disabled?: boolean;
  children: ReactNode;
};

export default function Button({
  buttonType,
  buttonIcon,
  action,
  disabled = false,
  children,
}: Buttonprops) {
  let buttonClassName = 'button text-style-3-bold';
  if (buttonType === ButtonTypes.SUBMIT) {
    buttonClassName += ' button-submit';
  } else if (buttonType === ButtonTypes.WARNING) {
    buttonClassName += ' button-warning';
  }
  if (buttonIcon) {
    buttonClassName += ' button-icon';
  }
  if (disabled) {
    buttonClassName += ' button-disabled';
  }

  return (
    <button className={buttonClassName} disabled={disabled} onClick={action}>
      {buttonIcon}
      {children}
    </button>
  );
}
