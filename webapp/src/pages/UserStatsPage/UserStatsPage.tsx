import './UserStatsPage.css';
import { Doughnut, Line } from 'react-chartjs-2';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserLevelWithTimestamp,
  GameControllerGetUserLevelHistoryModeEnum,
  GameControllerGetUserStatsModeEnum,
  UserLevelWithTimestampGameModeEnum,
  GameStats,
} from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LoadingPage } from '../index';
import 'chartjs-adapter-date-fns';
import { Header, IconVariant } from '../../shared/components';
import { useNavigation } from '../../shared/hooks/UseNavigation';

export default function UserStatsPage() {
  const { username } = useParams()!;
  const { goBack } = useNavigation();
  const getData = useCallback(
    () =>
      gameApi.gameControllerGetUserLevelHistory({
        username: username!,
        mode: GameControllerGetUserLevelHistoryModeEnum.Classic,
      }),
    [username],
  );
  const { data, isLoading } = useData<UserLevelWithTimestamp[]>(getData);
  const getStats = useCallback(
    () =>
      gameApi.gameControllerGetUserStats({
        username: username!,
        mode: GameControllerGetUserStatsModeEnum.Classic,
      }),
    [username],
  );
  const { data: stats, isLoading: areStatsLoading } =
    useData<GameStats>(getStats);
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(getUserByUserName);
  if (isLoading || isUserLoading || areStatsLoading) return <LoadingPage />;
  if (!data || !user || !stats) return <NotFoundPage />;
  data.unshift({
    username: user.username,
    timestamp: user.createdAt,
    gameMode: UserLevelWithTimestampGameModeEnum.Classic,
    level: 1,
    gameId: '', // maybe we should allow null in gameId here,
  });
  return (
    <div className="stats-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        {`game stats for '${user.username}'`}
      </Header>
      <div className="graphs">
        <div className="line-graph-wrapper">
          <Line
            data={{
              labels: data.map((item) => item.timestamp),
              datasets: [
                {
                  label: 'level',
                  data: data.map((item) => item.level),
                  borderWidth: 1,
                  stepped: true,
                },
              ],
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
                  data: [stats.wins, stats.losses, stats.draws],
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
