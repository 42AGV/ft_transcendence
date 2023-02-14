import React from 'react';
import './CollapsibleButton.css';
import Button, { ButtonProps, ButtonSize } from './Button';
import { IconVariant } from '../Icon/Icon';

export enum CollapsibleButtonState {
  COLLAPSED = 'collapsed',
  UNCOLLAPSED = 'uncollapsed',
}

type CollapsibleButtonProps = {
  props: ButtonProps;
  state?: CollapsibleButtonState;
  children?: string;
};

export default function CollapsibleButton({
  props,
  state = CollapsibleButtonState.COLLAPSED,
  children,
}: CollapsibleButtonProps): JSX.Element {
  const [collapsedState, setCollapsedState] =
    React.useState<CollapsibleButtonState>(state);
  const toggleCollapsedState = React.useCallback(() => {
    setCollapsedState(
      collapsedState === CollapsibleButtonState.COLLAPSED
        ? CollapsibleButtonState.UNCOLLAPSED
        : CollapsibleButtonState.COLLAPSED,
    );
  }, [collapsedState, setCollapsedState]);
  const localProps = {
    ...props,
    buttonSize: ButtonSize.CHIP,
    onClick: props.onClick,
  };
  return (
    <div className={`button-bubble-${collapsedState}`}>
      <div className="collapsible-button">
        <div className={`collapsible-button-${collapsedState}`}>
          <Button
            {...{
              ...props,
              buttonSize: ButtonSize.SMALL,
              iconVariant:
                collapsedState === CollapsibleButtonState.COLLAPSED
                  ? IconVariant.ARROW_BACK
                  : IconVariant.ARROW_FORWARD,
              onClick: toggleCollapsedState,
            }}
          />
          <Button
            {...{
              ...localProps,
              iconVariant: undefined,
              children: localProps.children ?? children,
            }}
          />
        </div>
      </div>
    </div>
  );
}
