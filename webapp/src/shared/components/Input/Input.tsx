import { Color } from '../../types';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import './Input.css';

export enum InputVariant {
  LIGHT = 'light',
  DARK = 'dark',
}

type InputProps = {
  variant?: InputVariant;
  label?: string;
  iconVariant?: IconVariant;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  type?: string;
  disabled?: boolean;
};

export default function Input({
  variant,
  label,
  iconVariant,
  placeholder,
  value,
  onChange,
  name,
  type,
  disabled = false,
}: InputProps) {
  return (
    <div className="input">
      <label className="subheading-bold">{label}</label>
      <div
        className={`input-container input-container-${variant} ${
          disabled ? 'input-container-disabled' : ''
        }`}
      >
        {iconVariant && (
          <Icon
            variant={iconVariant}
            size={IconSize.LARGE}
            color={variant === InputVariant.DARK ? Color.LIGHT : Color.DARK}
          ></Icon>
        )}
        <input
          className={`input-form input-form-${variant} paragraph-regular ${
            disabled ? 'input-form-disabled' : ''
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          type={type}
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
