import './UserStatsPage.css';
import { Line } from 'react-chartjs-2';
import { gameApi } from '../../shared/services/ApiService';
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
        limit: 20,
        offset: 0,
      }),
    [username],
  );
  const { data, isLoading } = useData<UserLevelWithTimestamp[]>(getData);
  if (isLoading) return <LoadingPage />;
  if (!data) return <NotFoundPage />;
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
                unit: 'day',
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
