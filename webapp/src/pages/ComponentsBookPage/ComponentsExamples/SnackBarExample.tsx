import * as React from 'react';

import { Button, ButtonVariant } from '../../../shared/components';
import { BookSection } from '../BookSection';
import { useNotificationContext } from '../../../shared/context/NotificationContext';

export const SnackBarExample = () => {
  const { notify, warn } = useNotificationContext();

  return (
    <>
      <BookSection title="Snack bar component" displayVertical>
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => notify('This is an informative notification!')}
        >
          informative notification
        </Button>
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => warn('This is a warn notification!')}
        >
          warning notification
        </Button>
      </BookSection>
    </>
  );
};
