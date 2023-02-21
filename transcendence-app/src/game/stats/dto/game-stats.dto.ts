export interface GameStatsData {
  winRatio: number;
}

export class GameStats {
  winRatio: number;
  loseRatio: number;

  constructor({ winRatio }: GameStatsData) {
    this.winRatio = winRatio;
    this.loseRatio = 1 - this.winRatio;
  }
}
