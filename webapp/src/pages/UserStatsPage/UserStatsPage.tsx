import './UserStatsPage.css';
import { Doughnut, Line } from 'react-chartjs-2';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  GameControllerGetUserLevelHistoryModeEnum,
  GameControllerGetUserStatsModeEnum,
  GameStats,
  UserLevelWithTimestamp,
} from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LoadingPage } from '../index';
import 'chartjs-adapter-date-fns';
import { Header, IconVariant } from '../../shared/components';
import { useNavigation } from '../../shared/hooks/UseNavigation';

type FiveArray<T> = [T, T, T, T, T];
type proArray = [
  UserLevelWithTimestamp[],
  GameControllerGetUserLevelHistoryModeEnum,
];
export default function UserStatsPage() {
  const { username } = useParams()!;
  const { goBack } = useNavigation();
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(getUserByUserName);
  const getLevelHistory = useCallback(async (): Promise<
    FiveArray<UserLevelWithTimestamp[]>
  > => {
    try {
      if (!user) {
        return Promise.reject('Unresolved');
      }
      let pclassic: proArray = [
        await gameApi.gameControllerGetUserLevelHistory({
          username: username!,
          mode: GameControllerGetUserLevelHistoryModeEnum.Classic,
        }),
        GameControllerGetUserLevelHistoryModeEnum.Classic,
      ];
      let pmystery: proArray = [
        await gameApi.gameControllerGetUserLevelHistory({
          username: username!,
          mode: GameControllerGetUserLevelHistoryModeEnum.MysteryZone,
        }),
        GameControllerGetUserLevelHistoryModeEnum.MysteryZone,
      ];
      let pshort: proArray = [
        await gameApi.gameControllerGetUserLevelHistory({
          username: username!,
          mode: GameControllerGetUserLevelHistoryModeEnum.ShortPaddle,
        }),
        GameControllerGetUserLevelHistoryModeEnum.ShortPaddle,
      ];
      let ptrain: proArray = [
        await gameApi.gameControllerGetUserLevelHistory({
          username: username!,
          mode: GameControllerGetUserLevelHistoryModeEnum.Training,
        }),
        GameControllerGetUserLevelHistoryModeEnum.Training,
      ];
      let punknown: proArray = [
        await gameApi.gameControllerGetUserLevelHistory({
          username: username!,
          mode: GameControllerGetUserLevelHistoryModeEnum.Unknown,
        }),
        GameControllerGetUserLevelHistoryModeEnum.Unknown,
      ];
      [pclassic, pmystery, pshort, ptrain, punknown].map((levels) => {
        return levels[0].unshift({
          username: user.username,
          timestamp: user.createdAt,
          gameMode: levels[1],
          level: 1,
          gameId: '', // maybe we should allow null in gameId here,
        });
      });
      return [pclassic[0], pmystery[0], pshort[0], ptrain[0], punknown[0]];
    } catch (e) {
      return Promise.reject('Unresolved');
    }
  }, [user, username]);
  const { data: levels, isLoading: areLevelsLoading } = useData<
    FiveArray<UserLevelWithTimestamp[]>
  >(
    getLevelHistory,
    useCallback(() => {}, []),
  );
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
              datasets: levels.map((level) => {
                return {
                  label: level[0].gameMode,
                  data: level.map((item) => {
                    return {
                      x: item.timestamp,
                      y: item.level,
                    };
                  }),
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
