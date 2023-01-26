import { Timer } from '../../../shared/components';
import { BookSection } from '../BookSection';

export const TimerExample = () => (
  <BookSection title="Timer component">
    <Timer timeString={'00:00:10'} isBackwardsCount={true} />
  </BookSection>
);
