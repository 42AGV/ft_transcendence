import { useState } from 'react';
import { Color } from '../../types';
import Icon, { IconSize, IconVariant } from '../Icon/Icon';
import './Input.css';

export enum InputColor {
  LIGHT = 'light',
  DARK = 'dark',
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
    // <form className={`form-container-${color} subheading-bold`}>
    //   <label>{label}</label>
    <div className={`input-container input-container-${color}`}>
      {iconVariant && (
        <Icon
          variant={iconVariant}
          size={IconSize.SMALL}
          color={color === InputColor.DARK ? Color.LIGHT : Color.DARK}
        ></Icon>
      )}
      <input
        className={`input-form input-form-${color} paragraph-regular`}
        placeholder={input}
      />
    </div>
    // </form>
  );
}
