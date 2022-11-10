import * as React from 'react';

import { Text, TextVariant } from '../index';

import './Snackbar.css';

type SnackbarSlidePositions = 'top' | 'bottom';

type SnackbarType = 'warning' | 'info';

type SnackbarProps = {
  visible: boolean;
  text: string;
  closeOnTap?: boolean;
  position: SnackbarSlidePositions;
  type: SnackbarType;
};

export default function Snackbar({
  visible,
  text,
  position,
  type,
  closeOnTap = false,
}: SnackbarProps) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }
  }, [visible]);

  const onAnimationEnd = () => {
    if (!visible) {
      setShouldRender(false);
    }
  };

  return (
    <>
      {shouldRender && (
        <div
          className={`
            snackbar
            snackbar-type-${type}
          `}
          style={{
            animation: `${
              visible
                ? `slide-in-${position} forwards`
                : `slide-out-${position}`
            } 0.5s`,
          }}
          onAnimationEnd={onAnimationEnd}
        >
          <Text variant={TextVariant.CAPTION}>{text}</Text>
        </div>
      )}
    </>
  );
}
