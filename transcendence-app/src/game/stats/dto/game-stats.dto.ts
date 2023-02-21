export interface GameStatsData {
  winRatio: number;
  tieRatio: number;
}

export class GameStats {
  winRatio: number;
  tieRatio: number;
  loseRatio: number;

  constructor({ winRatio, tieRatio }: GameStatsData) {
    this.winRatio = winRatio;
    this.tieRatio = tieRatio;
    this.loseRatio = 1 - this.winRatio - this.tieRatio;
  }
}
