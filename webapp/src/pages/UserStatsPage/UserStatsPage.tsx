import './UserStatsPage.css';
import { Line } from 'react-chartjs-2';
import { gameApi } from '../../shared/services/ApiService';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { GameControllerGetUserLevelHistoryModeEnum } from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';

export default function UserStatsPage() {
  const { username } = useParams()!;
  const getData = useCallback(
    () =>
      gameApi.gameControllerGetUserLevelHistory({
        username: username!,
        mode: GameControllerGetUserLevelHistoryModeEnum.Classic,
        limit: 100000,
        offset: 0,
      }),
    [],
  );
  const { data, isLoading } = useData(getData);
  return (
    <div className="stats-page">
      <Line
        data={{
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
              stepped: true,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}
