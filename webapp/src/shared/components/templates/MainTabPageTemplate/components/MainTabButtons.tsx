import './MainTabButtons.css';
import * as React from 'react';
import { ButtonProps, ReactiveButton } from '../../../index';
import { useMediaQuery } from '../../../../hooks/UseMediaQuery';

export type MainTabButtonsProps = {
  buttons: ButtonProps[];
};

type ElementNumber = number;
type DownwardsPercent = number;

const yDisplacementTable = new Map<ElementNumber, DownwardsPercent>([
  [0, 0],
  [1, 0],
  [2, 30],
  [3, 34],
  [4, 38],
  [5, 43],
]);

export default function MainTabButtons({ buttons }: MainTabButtonsProps) {
  const windowIsBig = useMediaQuery(768);
  let style: React.CSSProperties | undefined;

  if (!windowIsBig) {
    style = {
      transform: `translateY(${yDisplacementTable.get(buttons.length) ?? 0}%)`,
    };
  }
  const buttonElements = (
    <div className="main-tab-buttons" style={style}>
      {buttons.map((buttonProp: ButtonProps, idx) => (
        <ReactiveButton
          key={idx}
          {...{
            ...buttonProp,
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      className="main-tab-buttons-wrapper"
      style={{
        transform: `translateY(-${
          yDisplacementTable.get(
            buttons.length && windowIsBig ? 0 : buttons.length,
          ) ?? 0
        }%)`,
      }}
    >
      {buttonElements}
    </div>
  );
}
