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
import { useGameMatching } from '../../shared/hooks/UseGameMatching';
import { PLAY_GAME_URL, PLAY_URL } from '../../shared/urls';
import { useEffect } from 'react';

export default function GameQueuePage() {
  const { isPlaying, gameRoomId } = useGameMatching();
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
          socket.emit('leaveChatroom');
          navigate(PLAY_URL);
        }}
      >
        {'Quit'}
      </Button>
    </div>
  );
}
