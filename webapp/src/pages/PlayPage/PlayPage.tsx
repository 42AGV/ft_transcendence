import * as React from 'react';
import { ButtonVariant, IconVariant } from '../../shared/components';
import { useNavigate } from 'react-router-dom';
import { MainTabTemplate } from '../../shared/components/index';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import { PLAY_GAME_TRAIN_URL } from '../../shared/urls';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { Query } from '../../shared/types';
import socket from '../../shared/socket';
import { useGamePairing } from '../../shared/hooks/UseGamePairing';
import { gameQueueClientToServerWsEvents } from 'transcendence-shared';
import { GamePairingStatusDtoGameQueueStatusEnum } from '../../shared/generated';

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
    <SearchContextProvider fetchFn={mockFetchFn} maxEntries={ENTRIES_LIMIT}>
      <MainTabTemplate dataMapper={mockedMapper} buttons={buttons} />
    </SearchContextProvider>
  );
}
