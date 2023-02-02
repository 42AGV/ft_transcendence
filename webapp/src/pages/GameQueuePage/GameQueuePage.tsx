import {
  Button,
  ButtonVariant,
  GameSpinner,
  Header,
  IconVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import './GameQueuePage.css';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import socket from '../../shared/socket';
import { useGamePairing } from '../../shared/hooks/UseGamePairing';
import { PLAY_GAME_URL, PLAY_URL } from '../../shared/urls';
import { useEffect } from 'react';

export default function GameQueuePage() {
  const { setGameCtx, isPlaying, gameRoomId } = useGamePairing();
  const { navigate, goBack } = useNavigation();
  useEffect(() => {
    if (isPlaying && gameRoomId) {
      navigate(`${PLAY_GAME_URL}/${gameRoomId}`);
    }
  }, [isPlaying, gameRoomId, navigate]);
  return (
    <div className="game-queue-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {'game queue'}
      </Header>
      <Text
        variant={TextVariant.SUBHEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.MEDIUM}
      >
        {'waiting for an opponent'}
      </Text>
      <GameSpinner scaleInPercent={200} />
      <Button
        variant={ButtonVariant.WARNING}
        iconVariant={IconVariant.LOGOUT}
        onClick={() => {
          socket.emit('gameQuitWaiting');
          setGameCtx &&
            setGameCtx({ isPlaying, isWaitingToPlay: false, gameRoomId: null });
          goBack();
        }}
      >
        {'Quit'}
      </Button>
    </div>
  );
}
