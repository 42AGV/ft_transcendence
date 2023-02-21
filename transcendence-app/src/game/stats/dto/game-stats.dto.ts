export interface GameStatsData {
  wins: number;
  draws: number;
  loses: number;
}

export class GameStats {
  wins: number;
  draws: number;
  loses: number;

  constructor({ wins, draws, loses }: GameStatsData) {
    this.wins = wins;
    this.draws = draws;
    this.loses = loses;
  }
}
