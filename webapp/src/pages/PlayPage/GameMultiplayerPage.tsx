import { Game } from '../../shared/components';
import { useParams } from 'react-router-dom';

import './GamePage.css';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

export default function GameTrainPage() {
  const { gameId } = useParams();

  if (!gameId) {
    return <NotFoundPage />;
  }

  return (
    <div className="game-page">
      <Game gameId={gameId} />
    </div>
  );
}
