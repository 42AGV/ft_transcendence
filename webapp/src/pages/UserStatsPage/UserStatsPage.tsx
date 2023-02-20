import './UserStatsPage.css';
import { Line } from 'react-chartjs-2';

export default function UserStatsPage() {
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
            },
          ],
        }}
      />
    </div>
  );
}
