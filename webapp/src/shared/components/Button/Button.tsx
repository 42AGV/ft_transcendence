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
  return (
    <button
      className={`button subheading-bold button-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <div className="button-icon">{icon}</div>}
      {children}
    </button>
  );
}
