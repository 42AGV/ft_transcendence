import {
  GameMultiplayerTraining,
  Header,
  IconVariant,
} from '../../shared/components';
import { useNavigation } from '../../shared/hooks/UseNavigation';

import './GamePage.css';

export default function GameTrainPage() {
  const { goBack } = useNavigation();

  return (
    <div className="game-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        Hit the brick!
      </Header>
      <GameMultiplayerTraining />
    </div>
  );
}
