import { BookSection } from '../BookSection';
import GameSpinner from '../../../shared/components/GameSpinner/GameSpinner';

export function GameSpinnerExample() {
  return (
    <BookSection title="GameSpinner component">
      <GameSpinner scaleInPercent={100} />
    </BookSection>
  );
}
