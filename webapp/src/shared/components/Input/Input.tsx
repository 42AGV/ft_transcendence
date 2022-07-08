import { useState } from 'react';
import { Color } from '../../types';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import './Input.css';

export enum InputColor {
  LIGHT = 'color-light',
  DARK = 'color-dark',
}

type InputProps = {
  color?: InputColor;
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
  const [content, setContent] = useState();
  return (
    <form className="form-container subheading-bold">
      <label>{label}</label>
      <div className="input-container">
        {iconVariant && (
          <Icon
            variant={iconVariant}
            size={IconSize.SMALL}
            color={Color.DARK}
          ></Icon>
        )}
        <input className="input-form paragraph-regular" placeholder={input} />
      </div>
    </form>
  );
}
