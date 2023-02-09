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
import { GamePairingStatusDtoGameQueueStatusEnum } from '../../shared/generated';
import { useEffect } from 'react';

export default function GameQueuePage() {
  const { gameQueueStatus } = useGamePairing();
  const { goBack, navigate } = useNavigation();
  const quitAndGoBack = () => {
    if (gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.Waiting) {
      socket.emit(gameQueueClientToServerWsEvents.gameQuitWaiting);
    }
    goBack();
  };

  useEffect(() => {
    if (gameQueueStatus !== GamePairingStatusDtoGameQueueStatusEnum.Waiting) {
      goBack();
    }
  }, [gameQueueStatus, goBack]);

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
          }
          navigate(PLAY_URL, { replace: true });
        }}
      >
        {'Quit'}
      </Button>
    </div>
  );
}
