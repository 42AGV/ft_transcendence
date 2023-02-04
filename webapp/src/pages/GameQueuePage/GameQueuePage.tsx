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
import { gameQueueClientToServerWsEvents } from 'pong-engine';
import { PLAY_URL } from '../../shared/urls';

export default function GameQueuePage() {
  const { setGameCtx, isPlaying } = useGamePairing();
  const { goBack, navigate } = useNavigation();
  const quitAndGoBack = () => {
    socket.emit(gameQueueClientToServerWsEvents.gameQuitWaiting);
    setGameCtx &&
      setGameCtx({ isPlaying, isWaitingToPlay: false, gameRoomId: null });
    goBack();
  };
  return (
    <div className="game-queue-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={quitAndGoBack}>
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
          socket.emit(gameQueueClientToServerWsEvents.gameQuitWaiting);
          setGameCtx &&
            setGameCtx({ isPlaying, isWaitingToPlay: false, gameRoomId: null });
          navigate(PLAY_URL, { replace: true });
        }}
      >
        {'Quit'}
      </Button>
    </div>
  );
}
