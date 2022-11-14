import './MainTabButtons.css';
import * as React from 'react';
import { Button, ButtonProps, ButtonSize } from '../../../index';
import { useMediaQuery } from '../../../../hooks/UseMediaQuery';

export type MainTabButtonsProps = {
  buttons: ButtonProps[];
};

const calcDownwardsDisplacement = (len: number): number => {
  switch (len) {
    case 0:
      return 0;
    case 1:
      return 0;
    case 2:
      return 30;
    case 3:
      return 34;
    case 4:
      return 38;
    default:
    case 5:
      return 43;
  }
};

export default function MainTabButtons({ buttons }: MainTabButtonsProps) {
  const windowIsBig = useMediaQuery(768);
  let style: React.CSSProperties | undefined;

  let buttonSize = ButtonSize.LARGE;
  if (!windowIsBig) {
    style = {
      transform: `translateY(${calcDownwardsDisplacement(buttons.length)}%)`,
    };
    buttonSize = ButtonSize.SMALL;
  }
  const buttonElements = (
    <div className="main-tab-buttons" style={style}>
      {buttons.map((buttonProp: ButtonProps, idx) => (
        <Button
          key={idx}
          {...({
            ...buttonProp,
            buttonSize: buttonSize,
          } as ButtonProps)}
        />
      ))}
    </div>
  );

  return (
    <div
      className="main-tab-buttons-wrapper"
      style={{
        transform: `translateY(-${calcDownwardsDisplacement(
          buttons.length && windowIsBig ? 0 : buttons.length,
        )}%)`,
      }}
    >
      {buttonElements}
    </div>
  );
}
