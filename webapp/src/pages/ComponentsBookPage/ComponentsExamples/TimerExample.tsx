import { useState } from 'react';
import {
  Button,
  ButtonVariant,
  IconVariant,
  Timer,
} from '../../../shared/components';
import { BookSection, BookSubsection } from '../BookSection';

export const TimerExample = () => {
  const [shouldRun, setShouldRun] = useState<boolean>(true);
  const oncLick = () => {
    setShouldRun(!shouldRun);
  };
  return (
    <BookSection title="Timer component">
      <BookSubsection title="Regular backwards timer">
        <Timer timeString={'00:00:30'} isBackwardsCount={true} />
      </BookSubsection>
      <BookSubsection title="Forward timer, until 00:10, with start stop button">
        <Timer
          timeString={'00:00:10'}
          isBackwardsCount={false}
          shouldRun={shouldRun}
        />
        <Button
          variant={ButtonVariant.SUBMIT}
          iconVariant={IconVariant.ARROW_FORWARD}
          onClick={oncLick}
        >
          {'start/stop'}
        </Button>
      </BookSubsection>
    </BookSection>
  );
};
