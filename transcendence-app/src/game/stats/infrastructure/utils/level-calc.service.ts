import { Injectable } from '@nestjs/common';

export enum GameResult {
  LOSE = 0,
  DRAW = 0.5,
  WIN = 1,
}

@Injectable()
export class LevelCalculatorService {
  private readonly MINIMUM_LEVEL = 1;
  private readonly MINIMUM_ELO = 1000;
  private readonly ELO_STEPS_PER_LEVEL = 50;
  private readonly HYPOTHETICAL_ELO_AT_ZERO_LEVEL =
    this.MINIMUM_ELO - this.ELO_STEPS_PER_LEVEL;
  private readonly K = 128; // normal is 32, but we want quicker change

  private levelToElo = (level: number) => {
    return Math.max(
      Math.floor(
        this.ELO_STEPS_PER_LEVEL * level + this.HYPOTHETICAL_ELO_AT_ZERO_LEVEL,
      ),
      this.MINIMUM_ELO,
    );
  };

  private eloToLevel = (elo: number) => {
    return Math.max(
      (elo - this.HYPOTHETICAL_ELO_AT_ZERO_LEVEL) / this.ELO_STEPS_PER_LEVEL,
      this.MINIMUM_LEVEL,
    );
  };

  private delta = (
    currentRating: number,
    opponentRating: number,
    status: GameResult,
  ) => {
    const probabilityOfWin =
      1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    return Math.round(this.K * (status - probabilityOfWin));
  };

  private getNewEloRating = (
    currentRating: number,
    opponentRating: number,
    status: GameResult,
  ) => {
    return currentRating + this.delta(currentRating, opponentRating, status);
  };

  public getNewLevel = (
    currentLevel: number,
    opponentLevel: number,
    status: GameResult,
  ) => {
    return this.eloToLevel(
      this.getNewEloRating(
        this.levelToElo(currentLevel),
        this.levelToElo(opponentLevel),
        status,
      ),
    );
  };
}
