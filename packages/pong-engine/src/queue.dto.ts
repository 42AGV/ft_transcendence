export type GameChallengeDto = {
  gameRoomId: string;
  from: {
    username: string;
    id: string;
  };
};

export enum GameChallengeStatus {
  CHALLENGE_DECLINED = 'challengeDeclined',
  CHALLENGE_ACCEPTED = 'challengeAccepted',
}

export enum GameStatus {
  READY = 'ready',
  FINISHED = 'finished',
}

export type GameChallengeResponseDto = {
  gameRoomId: string;
  status: GameChallengeStatus;
};

type GameAcceptedDto = {
  status: GameChallengeStatus.CHALLENGE_ACCEPTED;
  gameRoomId: string;
};

type GameReadyDto = {
  status: GameStatus.READY;
  gameRoomId: string;
};

type GameDeclinedDto = {
  status: GameChallengeStatus.CHALLENGE_DECLINED;
  gameRoomId?: never;
};

type GameFinishedDto = {
  status: GameStatus.FINISHED;
  gameRoomId?: never;
};

export type GameStatusUpdateDto =
  | GameAcceptedDto
  | GameReadyDto
  | GameDeclinedDto
  | GameFinishedDto;
