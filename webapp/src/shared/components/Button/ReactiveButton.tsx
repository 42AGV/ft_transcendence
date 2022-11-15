import './ReactiveButton.css';
import React from 'react';
import Button, { ButtonProps, ButtonSize } from './Button';

export default function ReactiveButton(props: ButtonProps) {
  return (
    <div className="reactive-button">
      <Button {...{ ...props, buttonSize: ButtonSize.SMALL }} />
      <Button {...{ ...props, buttonSize: ButtonSize.LARGE }} />
    </div>
  );
}
