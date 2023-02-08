import * as React from 'react';
import { ButtonVariant, IconVariant } from '../../shared/components';
import { useNavigate } from 'react-router-dom';
import { MainTabTemplate } from '../../shared/components/index';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { PLAY_GAME_QUEUE, PLAY_GAME_TRAIN_URL } from '../../shared/urls';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { Query } from '../../shared/types';
import socket from '../../shared/socket';
import { useGamePairing } from '../../shared/hooks/UseGamePairing';
import { gameQueueClientToServerWsEvents } from 'pong-engine';
import { GamePairingStatusDtoGameQueueStatusEnum } from '../../shared/generated';
import { useCallback, useMemo } from 'react';

export default function PlayPage() {
  const { gameQueueStatus } = useGamePairing();
  const navigate = useNavigate();

  // To be replaced with real games request
  const mockFetchFn = React.useCallback(
    (requestParams: Query): Promise<unknown[]> => {
      return new Promise((resolve) => resolve([]));
    },
    [],
  );
  const mockedMapper = React.useCallback(
    (data: unknown) => ({
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: {
        url: '#',
        XCoordinate: 0,
        YCoordinate: 0,
      },
      url: '#',
      title: '',
      subtitle: 'level x',
      key: '',
    }),
    [],
  );

  const getButtonAction = useCallback(() => {
    switch (gameQueueStatus) {
      case GamePairingStatusDtoGameQueueStatusEnum.None: {
        return () => {
          socket.emit(gameQueueClientToServerWsEvents.gameQueueJoin);
          navigate(PLAY_GAME_QUEUE);
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
  }, [gameQueueStatus, navigate]);

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

  return (
    <SearchContextProvider fetchFn={mockFetchFn} maxEntries={ENTRIES_LIMIT}>
      <MainTabTemplate dataMapper={mockedMapper} buttons={buttons} />
    </SearchContextProvider>
  );
}
