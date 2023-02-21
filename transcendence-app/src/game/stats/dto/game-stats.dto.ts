export interface GameStatsData {
  wins: number;
  draws: number;
  losses: number;
}

export class GameStats {
  wins: number;
  draws: number;
  losses: number;

  constructor({ wins, draws, losses }: GameStatsData) {
    this.wins = wins;
    this.draws = draws;
    this.losses = losses;
  }
}
