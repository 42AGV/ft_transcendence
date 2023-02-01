import { Game } from '../../shared/components';
import { useParams } from 'react-router-dom';

import './GamePage.css';

export default function GameTrainPage() {
  const { gameId } = useParams();

  return (
    <div className="game-page">
      <Game gameId={gameId ?? ''} />
    </div>
  );
}
