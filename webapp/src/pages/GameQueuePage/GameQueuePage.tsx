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
import { gameQueueClientToServerWsEvents } from 'transcendence-shared';
import { PLAY_URL } from '../../shared/urls';
import { GamePairingStatusDtoGameQueueStatusEnum } from '../../shared/generated';

export default function GameQueuePage() {
  const { gameQueueStatus, setGameCtx } = useGamePairing();
  const { goBack, navigate } = useNavigation();
  const quitAndGoBack = () => {
    if (gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.Waiting) {
      socket.emit(gameQueueClientToServerWsEvents.gameQuitWaiting);
      setGameCtx &&
        setGameCtx({
          gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum.None,
          gameRoomId: null,
        });
    }
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
          if (
            gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.Waiting
          ) {
            socket.emit(gameQueueClientToServerWsEvents.gameQuitWaiting);
            setGameCtx &&
              setGameCtx({
                gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum.None,
                gameRoomId: null,
              });
          }
          navigate(PLAY_URL, { replace: true });
        }}
      >
        {'Quit'}
      </Button>
    </div>
  );
}
