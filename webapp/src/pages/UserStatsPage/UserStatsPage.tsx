import './UserStatsPage.css';
import { Doughnut, Line } from 'react-chartjs-2';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserLevelWithTimestamp,
  GameControllerGetUserLevelHistoryModeEnum,
  GameControllerGetUserStatsModeEnum,
  GameStats,
} from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LoadingPage } from '../index';
import 'chartjs-adapter-date-fns';
import { Header, IconVariant } from '../../shared/components';
import { useNavigation } from '../../shared/hooks/UseNavigation';

type GameModeLevels = {
  [key in GameControllerGetUserLevelHistoryModeEnum]: UserLevelWithTimestamp[];
};

export default function UserStatsPage() {
  const { username } = useParams()!;
  const { goBack } = useNavigation();
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(getUserByUserName);
  const getLevelHistory = useCallback(async (): Promise<
    UserLevelWithTimestamp[]
  > => {
    try {
      if (!user) {
        return Promise.reject('Unresolved');
      }
      return gameApi.gameControllerGetUserLevelHistory({
        username: username!,
      });
    } catch (e) {
      return Promise.reject('Unresolved');
    }
  }, [user, username]);
  const { data: levels, isLoading: areLevelsLoading } = useData<
    UserLevelWithTimestamp[]
  >(
    getLevelHistory,
    useCallback(() => {}, []),
  );

  const getGameModeLevels = (): GameModeLevels | null => {
    if (!user) {
      return null;
    }
    const initialGameModeLevels: GameModeLevels = {
      training: [
        {
          username: user.username,
          timestamp: user.createdAt,
          gameMode: 'training',
          level: 1,
          gameId: '',
        },
      ],
      classic: [
        {
          username: user.username,
          timestamp: user.createdAt,
          gameMode: 'classic',
          level: 1,
          gameId: '',
        },
      ],
      shortPaddle: [
        {
          username: user.username,
          timestamp: user.createdAt,
          gameMode: 'shortPaddle',
          level: 1,
          gameId: '',
        },
      ],
      mysteryZone: [
        {
          username: user.username,
          timestamp: user.createdAt,
          gameMode: 'mysteryZone',
          level: 1,
          gameId: '',
        },
      ],
      unknown: [
        {
          username: user.username,
          timestamp: user.createdAt,
          gameMode: 'unknown',
          level: 1,
          gameId: '',
        },
      ],
    };
    if (!levels) {
      return initialGameModeLevels;
    }
    return levels.reduce<GameModeLevels>((gameModeLevels, level) => {
      switch (level.gameMode) {
        case 'training':
          return {
            ...gameModeLevels,
            training: [...gameModeLevels.training, level],
          };
        case 'classic':
          return {
            ...gameModeLevels,
            classic: [...gameModeLevels.classic, level],
          };
        case 'mysteryZone':
          return {
            ...gameModeLevels,
            mysteryZone: [...gameModeLevels.mysteryZone, level],
          };
        case 'shortPaddle':
          return {
            ...gameModeLevels,
            shortPaddle: [...gameModeLevels.shortPaddle, level],
          };
        case 'unknown':
          return {
            ...gameModeLevels,
            unknown: [...gameModeLevels.unknown, level],
          };
        default:
          return gameModeLevels;
      }
    }, initialGameModeLevels);
  };

  const getStats = useCallback(
    () =>
      Promise.all(
        [
          GameControllerGetUserStatsModeEnum.Classic,
          GameControllerGetUserStatsModeEnum.ShortPaddle,
          GameControllerGetUserStatsModeEnum.MysteryZone,
          GameControllerGetUserStatsModeEnum.Training,
          GameControllerGetUserStatsModeEnum.Unknown,
        ].map((mode) => {
          return gameApi.gameControllerGetUserStats({
            username: username!,
            mode,
          });
        }),
      ),
    [username],
  );
  const { data: stats, isLoading: areStatsLoading } =
    useData<GameStats[]>(getStats);
  if (areLevelsLoading || isUserLoading || areStatsLoading)
    return <LoadingPage />;
  if (!levels || !user || !stats) return <NotFoundPage />;
  const toArray = (stats: GameStats) => {
    return [stats.wins, stats.losses, stats.draws];
  };
  return (
    <div className="stats-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {`game stats for '${user.username}'`}
      </Header>
      <div className="graphs">
        <div className="line-graph-wrapper">
          <Line
            data={{
              datasets: Object.entries(getGameModeLevels()!).map((entry) => {
                const [gameMode, gameModeLevels] = entry;
                return {
                  label: gameMode,
                  data: gameModeLevels.map((item) => ({
                    x: item.timestamp,
                    y: item.level,
                  })),
                  borderWidth: 1,
                  stepped: true,
                };
              }),
            }}
            options={{
              plugins: {
                legend: { position: 'left', labels: { boxHeight: 1 } },
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'hour',
                    displayFormats: {
                      quarter: 'MMM YYYY',
                    },
                  },
                },
              },
              layout: {
                padding: 20,
              },
              maintainAspectRatio: false,
            }}
          />
        </div>
        <div className={'pie-chart-wrapper'}>
          <Doughnut
            data={{
              labels: ['win', 'loss', 'draw'],
              datasets: [
                {
                  data: toArray(
                    stats.reduce((prev, curr) => {
                      return {
                        wins: prev.wins + curr.wins,
                        losses: prev.losses + curr.losses,
                        draws: prev.draws + curr.draws,
                      };
                    }),
                  ),
                },
              ],
            }}
            options={{
              radius: '90%',
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
