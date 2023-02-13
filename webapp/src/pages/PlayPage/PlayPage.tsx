import * as React from 'react';
import { ButtonVariant, IconVariant } from '../../shared/components';
import { useNavigate } from 'react-router-dom';
import { MainTabTemplate } from '../../shared/components/index';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { PLAY_GAME_TRAIN_URL, PLAY_GAME_URL } from '../../shared/urls';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { Query } from '../../shared/types';
import socket from '../../shared/socket';
import { useGamePairing } from '../../shared/hooks/UseGamePairing';
import { gameQueueClientToServerWsEvents } from 'transcendence-shared';
import {
  GamePairingStatusDtoGameQueueStatusEnum,
  User,
} from '../../shared/generated';
import { useCallback, useMemo } from 'react';

type GameWithPlayers = {
  gameId: string;
  playerOne: User;
  playerTwo: User;
};

export default function PlayPage() {
  const { gameQueueStatus } = useGamePairing();
  const navigate = useNavigate();
  const [ongoingGames, setOngoingGames] = React.useState<GameWithPlayers[]>([]);

  const gameFetchFn = React.useCallback(
    (requestParams: Query): Promise<GameWithPlayers[]> => {
      const { search, offset } = requestParams;
      return new Promise((resolve) => {
        if (offset && offset >= ongoingGames.length) {
          resolve([]);
        }
        resolve(
          ongoingGames.filter((game) => {
            const { playerOne, playerTwo } = game;
            return search
              ? playerOne.username.includes(search) ||
                  playerTwo.username.includes(search)
              : true;
          }),
        );
      });
    },
    [ongoingGames],
  );
  const gameMapper = React.useCallback(
    (game: GameWithPlayers) => ({
      iconVariant: IconVariant.ARROW_FORWARD,
      url: `${PLAY_GAME_URL}/${game.gameId}`,
      title: `${game.playerOne.username} vs ${game.playerTwo.username}`,
      key: game.gameId,
    }),
    [],
  );

  const getButtonAction = useCallback(() => {
    switch (gameQueueStatus) {
      case GamePairingStatusDtoGameQueueStatusEnum.None: {
        return () => {
          socket.emit(gameQueueClientToServerWsEvents.gameQueueJoin);
        };
      }
      case GamePairingStatusDtoGameQueueStatusEnum.Playing: {
        return () => {
          socket.emit(gameQueueClientToServerWsEvents.gameQuitPlaying);
        };
      }
      case GamePairingStatusDtoGameQueueStatusEnum.Waiting: {
        return () => {
          socket.emit(gameQueueClientToServerWsEvents.gameQuitWaiting);
        };
      }
    }
  }, [gameQueueStatus]);

  const buttonLabel = useMemo(() => {
    switch (gameQueueStatus) {
      case GamePairingStatusDtoGameQueueStatusEnum.None: {
        return 'Join game queue';
      }
      case GamePairingStatusDtoGameQueueStatusEnum.Playing: {
        return 'Quit playing';
      }
      case GamePairingStatusDtoGameQueueStatusEnum.Waiting: {
        return 'Quit waiting';
      }
    }
  }, [gameQueueStatus]);

  const buttons = [
    {
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.PLAY,
      onClick: () => navigate(PLAY_GAME_TRAIN_URL),
      children: 'Training',
    },
    {
      variant:
        gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.None
          ? ButtonVariant.SUBMIT
          : ButtonVariant.WARNING,
      iconVariant:
        gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.None
          ? IconVariant.ADD
          : IconVariant.LOGOUT,
      onClick: getButtonAction(),
      children: buttonLabel,
    },
  ];

  React.useEffect(() => {
    function ongoingGamesListener(games: GameWithPlayers[]) {
      setOngoingGames(games);
    }

    function addGameListener(game: GameWithPlayers) {
      setOngoingGames((prevOngoingGames) => [...prevOngoingGames, game]);
    }

    function removeGameListener(gameId: string) {
      setOngoingGames((prevOngoingGames) =>
        prevOngoingGames.filter((ongoingGame) => gameId !== ongoingGame.gameId),
      );
    }

    socket.on('ongoingGames', ongoingGamesListener);
    socket.on('addGame', addGameListener);
    socket.on('removeGame', removeGameListener);
    socket.emit('getOngoingGames');

    return () => {
      socket.off('ongoingGames');
      socket.off('addGame');
      socket.off('removeGame');
    };
  }, []);

  return (
    <SearchContextProvider fetchFn={gameFetchFn} maxEntries={ENTRIES_LIMIT}>
      <MainTabTemplate dataMapper={gameMapper} buttons={buttons} />
    </SearchContextProvider>
  );
}
