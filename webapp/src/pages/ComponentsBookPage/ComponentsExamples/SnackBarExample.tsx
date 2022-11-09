import * as React from 'react';

import { SnackBar, Button, ButtonVariant } from '../../../shared/components';
import { BookSection } from '../BookSection';

export const SnackBarExample = () => {
  const [visibleTop, setVisibleTop] = React.useState(false);
  const [visibleBottom, setVisibleBottom] = React.useState(false);

  return (
    <>
      <BookSection title="Snack bar component" displayVertical>
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => setVisibleTop((prev) => !prev)}
        >
          {`${visibleTop ? 'hide' : 'show'} snack bar from top`}
        </Button>
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => setVisibleBottom((prev) => !prev)}
        >
          {`${visibleBottom ? 'hide' : 'show'} snack bar from bottom`}
        </Button>
      </BookSection>
      <SnackBar
        visible={visibleTop}
        text="This is a notification!"
        position="top"
        type="info"
      />
      <SnackBar
        visible={visibleBottom}
        text="This is a notification!"
        position="bottom"
        type="warning"
      />
    </>
  );
};
