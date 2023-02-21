import './UserStatsPage.css';
import { Line } from 'react-chartjs-2';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  GameControllerGetUserLevelHistoryModeEnum,
  UserLevelWithTimestamp,
} from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LoadingPage } from '../index';
import 'chartjs-adapter-date-fns';

export default function UserStatsPage() {
  const { username } = useParams()!;
  const getData = useCallback(
    () =>
      gameApi.gameControllerGetUserLevelHistory({
        username: username!,
        mode: GameControllerGetUserLevelHistoryModeEnum.Classic,
        limit: 20, // maybe we'd need more than 20 results
        offset: 0,
      }),
    [username],
  );
  const { data, isLoading } = useData<UserLevelWithTimestamp[]>(getData);
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData(getUserByUserName);
  if (isLoading || isUserLoading) return <LoadingPage />;
  if (!data || !user) return <NotFoundPage />;
  data.unshift({
    username: user.username,
    timestamp: new Date(user.createdAt.getTime() - 1000 * 60 * 60 * 24 * 5), // this a patch,
    // to account for the fact that we're seeding games with dates prior to the creation of the user,
    // which should not be possible. This should just be user.createdAt
    level: 1,
    gameId: '', // maybe we should allow null in gameId here,
  });
  return (
    <div className="stats-page">
      <Line
        data={{
          labels: data.map((item) => item.timestamp),
          datasets: [
            {
              label: 'level over time',
              data: data.map((item) => item.level),
              borderWidth: 1,
              stepped: true,
            },
          ],
        }}
        options={{
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
        }}
      />
    </div>
  );
}
