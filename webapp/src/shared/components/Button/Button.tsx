import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Button.css';

export enum ButtonVariant {
  SUBMIT = 'submit',
  WARNING = 'warning',
  ALTERNATIVE = 'submit-alternative',
}

type ButtonProps = {
  variant: ButtonVariant;
  iconVariant?: IconVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  form?: string;
  children: string;
};

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
      className={`button subheading-bold button-${variant}`}
      disabled={disabled}
      onClick={onClick}
      form={form}
    >
      {iconVariant && (
        <div className="button-icon">
          {<Icon variant={iconVariant} size={IconSize.SMALL}></Icon>}
        </div>
      )}
      {children}
    </button>
  );
}
