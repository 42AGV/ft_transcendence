import { User } from '../../../user/infrastructure/db/user.entity';
import { Game, GameData } from './game.entity';

export interface GameWithUsersData extends GameData {
  playerOneId: string;
  playerOneEmail: string;
  playerOneFullName: string;
  playerOnePassword: string | null;
  playerOneAvatarId: string;
  playerOneAvatarX: number;
  playerOneAvatarY: number;
  playerOneCreatedAt: Date;
  playerOneTwoFactorAuthenticationSecret: string | null;
  playerOneIsTwoFactorAuthenticationEnabled: boolean;
  playerTwoId: string;
  playerTwoEmail: string;
  playerTwoFullName: string;
  playerTwoPassword: string | null;
  playerTwoAvatarId: string;
  playerTwoAvatarX: number;
  playerTwoAvatarY: number;
  playerTwoCreatedAt: Date;
  playerTwoTwoFactorAuthenticationSecret: string | null;
  playerTwoIsTwoFactorAuthenticationEnabled: boolean;
}

export class GameWithUsers extends Game {
  playerOne: User;
  playerTwo: User;

  constructor(gameData: GameWithUsersData) {
    super(gameData);
    this.playerOne = new User({
      id: gameData.playerOneId,
      username: gameData.playerOneUsername,
      email: gameData.playerOneEmail,
      fullName: gameData.playerOneFullName,
      password: gameData.playerOnePassword,
      avatarId: gameData.playerOneAvatarId,
      avatarX: gameData.playerOneAvatarX,
      avatarY: gameData.playerOneAvatarY,
      createdAt: gameData.playerOneCreatedAt,
      twoFactorAuthenticationSecret:
        gameData.playerOneTwoFactorAuthenticationSecret,
      isTwoFactorAuthenticationEnabled:
        gameData.playerOneIsTwoFactorAuthenticationEnabled,
    });
    this.playerTwo = new User({
      id: gameData.playerTwoId,
      username: gameData.playerTwoUsername,
      email: gameData.playerTwoEmail,
      fullName: gameData.playerTwoFullName,
      password: gameData.playerTwoPassword,
      avatarId: gameData.playerTwoAvatarId,
      avatarX: gameData.playerTwoAvatarX,
      avatarY: gameData.playerTwoAvatarY,
      createdAt: gameData.playerTwoCreatedAt,
      twoFactorAuthenticationSecret:
        gameData.playerTwoTwoFactorAuthenticationSecret,
      isTwoFactorAuthenticationEnabled:
        gameData.playerTwoIsTwoFactorAuthenticationEnabled,
    });
  }
}
