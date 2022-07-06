import './Button.css';

export enum ButtonVariant {
  SUBMIT = 'submit',
  WARNING = 'warning',
}

type ButtonProps = {
  variant: ButtonVariant;
  icon?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  children: string;
};

export default function Button({
  variant,
  icon,
  onClick,
  disabled = false,
  children,
}: ButtonProps) {
  let className = 'button text-style-3-bold';
  className += ` button-${variant}`;
  if (icon) {
    className += ' button-icon';
  }

  return (
    <button
      className={`button text-style-3-bold button-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <div className="button-icon">{icon}</div>}
      {children}
    </button>
  );
}
