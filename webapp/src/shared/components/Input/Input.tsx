import { IconVariant } from '../Icon/Icon';

export enum InputColor {
  LIGHT = 'color-light',
  DARK = 'color-dark',
}

type InputProps = {
  color: InputColor;
  label?: string;
  iconVariant?: IconVariant;
  input?: string;
};

export default function Input({
  color,
  label,
  iconVariant,
  input,
}: InputProps) {
  return (
    <form className="input-form">
      <label>
        {label}
        <input type="text" />
      </label>
    </form>
  );
}
