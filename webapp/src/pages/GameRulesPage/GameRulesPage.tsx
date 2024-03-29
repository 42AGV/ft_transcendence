import { gameQueueClientToServerWsEvents } from 'transcendence-shared';
import {
  ButtonProps,
  ButtonVariant,
  Header,
  IconVariant,
  ReactiveButton,
  Text,
  TextVariant,
} from '../../shared/components';
import { GamePairingStatusDtoGameQueueStatusEnum } from '../../shared/generated';
import { useGamePairing } from '../../shared/hooks/UseGamePairing';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import socket from '../../shared/socket';
import { PLAY_GAME_TRAIN_URL } from '../../shared/urls';
import './GameRulesPage.css';

export default function GameRulesPage() {
  const { goBack, navigate } = useNavigation();
  const { gameQueueStatus } = useGamePairing();

  let buttons = [
    {
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.PLAY,
      onClick: () => navigate(PLAY_GAME_TRAIN_URL),
      children: 'Training',
    },
  ];

  if (gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.None) {
    buttons.push({
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.ADD,
      onClick: () => {
        socket.emit(gameQueueClientToServerWsEvents.gameQueueJoin);
      },
      children: 'Join game queue',
    });
  }

  return (
    <div className="game-rules-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        game rules
      </Header>
      <div className="game-rules-page-main">
        <div className="game-rules-page-main-objective">
          <Text variant={TextVariant.SUBHEADING}>Objective:</Text>
          <Text variant={TextVariant.PARAGRAPH}>
            The objective of the game is to score points by hitting the ball
            with the paddle and making it pass the opponent's paddle. The first
            player to reach 10 points wins the game.
          </Text>
        </div>
        <div className="game-rules-page-main-gameplay">
          <Text variant={TextVariant.SUBHEADING}>Gameplay:</Text>
          <ol>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                At the start of the game, the player one (the one who joined
                earlier) will see a list of different game modes to choose from.
                Once an option is chosen, the game will start once the opponent
                is ready.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                At the start of the game, the player two (the one who joined
                later) will have to click a "Ready" button to indicate whether
                is ready to play.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                Once both players have clicked the "Ready" button, the game
                starts.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                The players move their paddles using the left and right arrow
                keys on their keyboard, or by touching and dragging the paddle
                on a mobile device.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                Each time a player misses the ball, the other player scores a
                point.
              </Text>
            </li>
          </ol>
        </div>
        <div className="game-rules-page-main-disconnects">
          <Text variant={TextVariant.SUBHEADING}>
            Disconnects and quitting:
          </Text>
          <ol>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                If one of the players disconnects during the game, the game will
                be paused for up to 30 seconds or until the disconnected player
                reconnects.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                If the disconnected player reconnects within the 30 seconds, the
                game will resume from where it was paused.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                If the disconnected player does not reconnect within the 30
                seconds, the game will end and the player who did not disconnect
                will be declared the winner.
              </Text>
            </li>
            <li>
              <Text variant={TextVariant.PARAGRAPH}>
                If a player chooses to quit the game at any point, the other
                player will be declared the winner.
              </Text>
            </li>
          </ol>
        </div>
      </div>
      <div className="game-rules-page-buttons">
        {buttons.map((buttonProp: ButtonProps, idx) => (
          <ReactiveButton key={idx} {...buttonProp} />
        ))}
      </div>
    </div>
  );
}
