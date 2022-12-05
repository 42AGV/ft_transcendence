import Button, { ButtonProps, ButtonSize } from './Button';

import './ReactiveButton.css';

export default function ReactiveButton(props: ButtonProps) {
  return (
    <div className="reactive-button">
      <Button {...{ ...props, buttonSize: ButtonSize.CHIP }} />
      <Button {...{ ...props, buttonSize: ButtonSize.LARGE }} />
    </div>
  );
}
